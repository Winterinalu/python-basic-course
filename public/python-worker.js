importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

let pyodide;
let busy = false;
let outputBuffer = '';

function flushOutput(stream) {
  if (!outputBuffer) return;
  self.postMessage({ type: 'output', stream, text: outputBuffer });
  outputBuffer = '';
}

function writeOutput(stream, code) {
  outputBuffer += String.fromCharCode(code);
  if (code === 10) flushOutput(stream);
}

function readInputLine(inputState) {
  flushOutput('stdout');
  self.postMessage({ type: 'input-request' });
  const control = new Int32Array(inputState.buffer, 0, 2);
  Atomics.wait(control, 0, 0);
  const length = Atomics.load(control, 1);
  const bytes = new Uint8Array(inputState.buffer, 8, length).slice();
  const line = new TextDecoder().decode(bytes);
  Atomics.store(control, 0, 0);
  return line;
}

async function loadPython() {
  try {
    pyodide = await loadPyodide();
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ type: 'load-error', message: String(error) });
  }
}

self.onmessage = async ({ data }) => {
  if (data.type !== 'run' || !pyodide || busy) return;
  busy = true;
  outputBuffer = '';
  const inputState = { buffer: data.inputBuffer };

  pyodide.setStdout({ raw: (code) => writeOutput('stdout', code) });
  pyodide.setStderr({ raw: (code) => writeOutput('stderr', code) });
  pyodide.setStdin({ stdin: () => {
    if (!inputState.buffer) throw new Error('Interactive input is not available for this run.');
    return readInputLine(inputState);
  }, isatty: true });

  const globals = pyodide.toPy({});
  try {
    await pyodide.runPythonAsync(data.code, { globals });
    flushOutput('stdout');
    self.postMessage({ type: 'done' });
  } catch (error) {
    flushOutput('stdout');
    flushOutput('stderr');
    self.postMessage({ type: 'error', message: String(error) });
  } finally {
    globals.destroy();
    busy = false;
  }
};

loadPython();