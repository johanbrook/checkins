export const isDev = process.env.NODE_ENV === undefined || process.env.NODE_ENV == 'development';

interface ConfigInit {
    [key: string]: 1 | 0;
}

let INITED_CONFIG: ConfigInit = { __overwrite_me: 1 };

export const initConfig = (config: ConfigInit) => {
    for (const [k, req] of Object.entries(config)) {
        const v = process.env[k];

        const isOptional = req == 0;

        if (!isOptional && v === undefined) {
            throw new Error(`Missing required config: ${k}`);
        }

        if (isDev) {
            console.log(`${k}: ${v}`);
        }
    }

    INITED_CONFIG = config;

    return INITED_CONFIG;
}

export const getInitedConfig = () => {
    if (!!INITED_CONFIG.__overwrite_me) {
        throw new Error('Must call initConfig first!');
    }

    return INITED_CONFIG;
}
