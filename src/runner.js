const RUN_LIMIT = 10_000;
const INPUT_CAPACITY = 8192;

export function createPythonRunner(onEvent) {
  let worker;
  let status = 'loading';
  let active = null;
  let requestId = 0;

  function spawnWorker() {
    status = 'loading';
    onEvent({ type: 'loading' });
    worker = new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
    worker.onmessage = ({ data }) => {
      if (data.type === 'ready') {
        status = 'ready';
        onEvent({ type: 'ready' });
        return;
      }
      if (data.type === 'load-error') {
        status = 'failed';
        onEvent({ type: 'load-error' });
        return;
      }
      if (!active) return;
      if (data.type === 'output') onEvent({ ...data, requestId: active.id });
      if (data.type === 'input-request') {
        pauseTimer();
        onEvent({ type: 'input-request', requestId: active.id });
      }
      if (data.type === 'done' || data.type === 'error') finish(data);
    };
    worker.onerror = () => {
      if (active) finish({ type: 'error', message: 'The Python worker stopped unexpectedly.' });
      status = 'failed';
      onEvent({ type: 'load-error' });
    };
  }

  function startTimer(delay = RUN_LIMIT) {
    if (!active) return;
    active.remaining = delay;
    active.deadline = Date.now() + delay;
    active.timer = setTimeout(() => {
      if (!active) return;
      active = null;
      worker.terminate();
      spawnWorker();
      onEvent({ type: 'timeout' });
    }, delay);
  }

  function pauseTimer() {
    if (!active || !active.timer) return;
    clearTimeout(active.timer);
    active.timer = null;
    active.remaining = Math.max(0, active.deadline - Date.now());
  }

  function finish(result) {
    if (!active) return;
    clearTimeout(active.timer);
    const finished = active;
    active = null;
    onEvent({ ...result, requestId: finished.id });
  }

  function run(code, { interactive = false } = {}) {
    if (status !== 'ready' || active) return null;
    const id = ++requestId;
    let inputBuffer = null;
    if (interactive && window.crossOriginIsolated && typeof SharedArrayBuffer !== 'undefined') {
      inputBuffer = new SharedArrayBuffer(8 + INPUT_CAPACITY);
    }
    active = { id, inputBuffer, timer: null, deadline: 0, remaining: RUN_LIMIT };
    startTimer();
    worker.postMessage({ type: 'run', code, inputBuffer });
    return id;
  }

  function submitInput(value) {
    if (!active?.inputBuffer) return;
    const encoded = new TextEncoder().encode(value).slice(0, INPUT_CAPACITY - 1);
    const control = new Int32Array(active.inputBuffer, 0, 2);
    new Uint8Array(active.inputBuffer, 8, encoded.length).set(encoded);
    control[1] = encoded.length;
    Atomics.store(control, 0, 1);
    Atomics.notify(control, 0);
    startTimer(active.remaining);
  }

  function cancel({ restart = false } = {}) {
    if (active) clearTimeout(active.timer);
    active = null;
    if (restart) {
      worker.terminate();
      spawnWorker();
    }
  }

  function stop() {
    if (!active) return;
    cancel({ restart: true });
    onEvent({ type: 'stopped' });
  }

  spawnWorker();
  return {
    run,
    submitInput,
    cancel,
    stop,
    get status() { return status; },
    get running() { return Boolean(active); },
  };
}