importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

let pyodide;
let busy = false;
let outputBuffer = '';
let pendingInput = null;

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

function requestInput(prompt) {
  flushOutput('stdout');
  return new Promise((resolve) => {
    pendingInput = resolve;
    self.postMessage({ type: 'input-request', prompt: String(prompt ?? '') });
  });
}

async function runWithAsyncInput(code, globals) {
  globals.set('__source_code', code);
  globals.set('__input_bridge', requestInput);
  await pyodide.runPythonAsync(`
import ast
import sys as _input_sys

class InputTransformer(ast.NodeTransformer):
    def visit_Call(self, node):
        node = self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id == "input":
            prompt = node.args[0] if node.args else ast.Constant(value="")
            return ast.Await(
                value=ast.Call(
                    func=ast.Name(id="_input_async", ctx=ast.Load()),
                    args=[prompt],
                    keywords=[],
                )
            )
        return node

async def _input_async(prompt=""):
    _input_sys.stdout.flush()
    return await __input_bridge(str(prompt))

__tree = InputTransformer().visit(ast.parse(__source_code))
__function = ast.AsyncFunctionDef(
    name="__run_user_code",
    args=ast.arguments(
        posonlyargs=[],
        args=[],
        kwonlyargs=[],
        kw_defaults=[],
        defaults=[],
    ),
    body=__tree.body or [ast.Pass()],
    decorator_list=[],
)
__module = ast.fix_missing_locations(
    ast.Module(body=[__function], type_ignores=[])
)
exec(compile(__module, "<learner code>", "exec"), globals())
await __run_user_code()
`, { globals });
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
  if (data.type === 'submit-input') {
    if (!pendingInput) return;
    const resolveInput = pendingInput;
    pendingInput = null;
    resolveInput(String(data.value ?? ''));
    return;
  }
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
    if (data.interactive && !inputState.buffer) {
      await runWithAsyncInput(data.code, globals);
    } else {
      await pyodide.runPythonAsync(data.code, { globals });
    }
    flushOutput('stdout');
    self.postMessage({ type: 'done' });
  } catch (error) {
    flushOutput('stdout');
    flushOutput('stderr');
    self.postMessage({ type: 'error', message: String(error) });
  } finally {
    pendingInput = null;
    globals.destroy();
    busy = false;
  }
};

loadPython();