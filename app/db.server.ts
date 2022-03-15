import createClient, { Client } from "edgedb";
import { getConfig } from "./config.server";

export type { Client as EdgeDb } from "edgedb";

declare global {
    var __db: Client | undefined;
}

export const createEdgeDb = (): Client => {
    let db: Client;

    // this is needed because in development we don't want to restart
    // the server with every change, but we want to make sure we don't
    // create a new connection to the DB with every change either.
    if (getConfig('ENV') == 'production') {
        console.log('Creating EdgeDB client (production)');
        db = createClient();
    } else {
        if (!global.__db) {
            console.log('Creating EdgeDB client (dev)');
            global.__db = createClient();
        }
        db = global.__db;
    }

    return db;
}
