import createClient from 'edgedb';
import { test } from './_test-helper';
import assert from 'assert/strict';
import { createModel } from '../app/data.server';

const result = require('dotenv').config();

if (result.error) {
    throw result.error;
}

const beforeEach = () => {
    const db = createClient({
        database: 'checkins_test',
    });

    const model = createModel(db);

    return { model, db };
};

test('inserts a user by email', async () => {
    const { model, db } = beforeEach();

    await model.createUserIfNotExists('test@test.com');

    const user = await db.queryRequiredSingle('select User');

    console.log(user);
});
