import { initConfig, isDev } from './config-init';

if (isDev) {
    console.log(`Loading environment variables from .env`);

    const result = require("dotenv").config();

    if (result.error) {
        throw result.error;
    }
}

initConfig({
    EMAIL_PASSPHRASE: 1,
    EMAIL_HASH_KEY: 1,
    MAGIC_LINK_SECRET: 1,
    SESSION_SECRET: 1,
    ENV: 1,
    PORT: 0,
});

// no import since it needs to happen after initConfig
require("./server");
