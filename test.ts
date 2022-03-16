#!/usr/bin/env node -r esbuild-register --no-warnings

import fs from 'fs/promises';
import { basename } from 'path';
import { tests, TestCase } from './test/_test-helper';

// JOHAN'S RUDIMENTARY TEST RUNNER
//
// Will execute all test() calls in the "test" directory. Skips files prepended
// with an underscore.
//
// Usage:
//  node -r esbuild-register test.ts
// or
//  ./test.ts

const main = async () => {
    const files = await fs.readdir('./test');

    for (const file of files) {
        if (file.startsWith('_')) continue;

        require('./test/' + file);
    }

    const results = await runTests(tests);

    for (const res of results) {
        const filename = res.path ? basename(res.path) : '<unknown file>';

        if (res.fail) {
            console.error(Color.FgRed + '✗ ' + Color.Reset + Color.Dim + filename + Color.Reset + ' ' + res.name);
            if (res.error) console.error(Color.FgRed + res.error.message);
        } else {
            console.log(Color.FgGreen + '✓ ' + Color.Reset + Color.Dim + filename + Color.Reset + ' ' + res.name);
        }
    }
}

enum Color {
    FgGreen = "\x1b[32m",
    FgRed = "\x1b[31m",
    Reset = "\x1b[0m",
    Dim = "\x1b[2m",
}

interface TestResult {
    name: string;
    fail: boolean;
    error?: Error;
    path?: string;
}

const runTests = async (tests: Array<TestCase>): Promise<Array<TestResult>> =>
    Promise.all(tests.map(t =>
        Promise.resolve().then(t.test).then((): TestResult => ({
            ...t,
            fail: false,
        })).catch((err): TestResult => ({
            ...t,
            fail: true,
            error: err,
        }))
    ));

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

// makes this a module
export {}
