import { Jinter } from 'jintr';
import { Log } from '../lib.js';
const TAG = 'JsRuntime';
export default function evaluate(code, env) {
    Log.info(TAG, 'Evaluating JavaScript.\n', code);
    const runtime = new Jinter(code);
    for (const [key, value] of Object.entries(env)) {
        runtime.scope.set(key, value);
    }
    const result = runtime.interpret();
    Log.info(TAG, 'Done. Result:', result);
    return result;
}
//# sourceMappingURL=jinter.js.map