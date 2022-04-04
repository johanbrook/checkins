import { maskEmail } from '~/session.server';
import { test } from './_test-helper';
import assert from 'assert/strict';

test('masks email correctly', () => {
    assert.equal(maskEmail('johan@gmail.com'), 'j****@g****.com');
});
