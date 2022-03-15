import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";

import * as serverBuild from "@remix-run/dev/server-build";
import { createEdgeDb } from "~/db.server";
import { createModel, Model } from "~/data.server";
import { type Auth, mkAuth } from "~/session.server";
import { getConfig } from "~/config.server";

const db = createEdgeDb();
const model = createModel(db);
const auth = mkAuth(model);

export interface Context {
    model: Model;
    auth: Auth;
}

const app = express();

app.use(compression());

app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public/build", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all(
    "*",
    createRequestHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: (): Context => {
            return { model, auth };
        }
    })
);

const port = parseInt(getConfig('PORT', '3000'), 10);

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
