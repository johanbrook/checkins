type Test = () => void | Promise<void>;

export interface TestCase {
    name: string;
    test: Test;
    path?: string;
}

export const tests: Array<TestCase> = [];

/**
 * Usage:
 * 
 * ```ts
 * import assert from 'assert';
 * import { test } from './_test-helper';
 * 
 * test('Foo', () => {
     assert.equals(true, true);
 * });
 * ```
 */ 
export const test = (name: string, test: Test) => {
    tests.push({ name, test, path: getCallerFile() });
}

const getCallerFile = (): string | undefined => {
    let originalFunc = Error.prepareStackTrace;
    let callerfile: string | undefined;;

    try {
        const err = new Error();
        let currentfile: string | undefined;
        
        Error.prepareStackTrace = (_, stack) => stack;
        
        currentfile = (err.stack as unknown as NodeJS.CallSite[]).shift()?.getFileName() ?? undefined;

        while ((err.stack as unknown as NodeJS.CallSite[]).length) {
            callerfile = (err.stack as unknown as NodeJS.CallSite[]).shift()?.getFileName() ?? undefined;
            if (currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    return callerfile;
};
