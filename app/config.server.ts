export const getConfig = (key: string, def?: string): string => {
    const _ = require('../config-init').getInitedConfig();

    const val = process.env[key] || def;

    if (val === undefined) {
        console.error(`Missing env var: ${key}`);
        throw new Error(`Missing env var: ${key}`);
    }

    return val;
};
