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
    worker = new Worker(new URL('../python-worker.js', import.meta.url));
    worker.onmessage = ({ data }) => {
      if (data.type === 'ready') {
        status = 'ready';
        onEvent({ type: 'ready' });
        return;
      }
      if (data.type === 'load-error') {
        status = 'failed';
        onEvent({ type: 'load-error', message: data.message });
        return;
      }
      if (!active) return;
      if (data.type === 'output') onEvent({ ...data, requestId: active.id });
      if (data.type === 'input-request') {
        pauseTimer();
        onEvent({ ...data, requestId: active.id });
      }
      if (data.type === 'done' || data.type === 'error') finish(data);
    };
    worker.onerror = (event) => {
      if (active) finish({ type: 'error', message: event.message || 'The Python worker stopped unexpectedly.' });
      status = 'failed';
      onEvent({ type: 'load-error', message: event.message });
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
    active = { id, inputBuffer, interactive, timer: null, deadline: 0, remaining: RUN_LIMIT };
    startTimer();
    worker.postMessage({ type: 'run', code, inputBuffer, interactive });
    return id;
  }

  function submitInput(value) {
    if (!active?.interactive) return;
    if (active.inputBuffer) {
      const encoded = new TextEncoder().encode(value).slice(0, INPUT_CAPACITY - 1);
      const control = new Int32Array(active.inputBuffer, 0, 2);
      new Uint8Array(active.inputBuffer, 8, encoded.length).set(encoded);
      control[1] = encoded.length;
      Atomics.store(control, 0, 1);
      Atomics.notify(control, 0);
    } else {
      worker.postMessage({ type: 'submit-input', value });
    }
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