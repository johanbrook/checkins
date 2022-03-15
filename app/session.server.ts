import { createCookieSessionStorage, Session } from "remix";
import { Authenticator } from "remix-auth";
import { EmailLinkStrategy, SendEmailOptions } from "remix-auth-email-link";
import { getConfig } from "./config.server";
import type { Model } from "./data.server";

interface SessionUser {
    id: string;
}

const sendEmail = async (opts: SendEmailOptions<SessionUser>) => {
    console.log('Sending email: ' + opts.emailAddress);
    console.log(opts.magicLink);
}

export type Auth = Pick<Authenticator<SessionUser>, 'isAuthenticated' | 'authenticate' | 'logout'> & {
    getUserSession: (req: Request) => Promise<Session>;
    commitSession: (session: Session) => Promise<string>,
};

export const mkAuth = (model: Model): Auth => {
    const storage = createCookieSessionStorage({
        cookie: {
            name: "checkins_session",
            sameSite: "lax",
            path: "/",
            httpOnly: true,
            secrets: [getConfig('SESSION_SECRET')],
            maxAge: 60 * 60 * 24 * 30,
            secure: getConfig('ENV') == 'production',
        },
    });

    const auth = new Authenticator<SessionUser>(storage);

    auth.use(
        new EmailLinkStrategy(
            { sendEmail, secret: getConfig('MAGIC_LINK_SECRET'), callbackURL: '/magic', validateSessionMagicLink: true },
            async ({ email }: { email: string }) => {
                const user = await model.findUserByEmail(email);

                if (!user) {
                    console.log(`Couldn't find user with email "${maskEmail(email)}", creating new one`);
                    return model.createUserIfNotExists(email);
                };

                return { id: user.id };
            }
        )
    );

    return {
        authenticate: auth.authenticate.bind(auth),

        isAuthenticated: auth.isAuthenticated.bind(auth),

        logout: auth.logout.bind(auth),

        getUserSession: (req: Request) =>
            storage.getSession(req.headers.get('Cookie')),

        commitSession: storage.commitSession.bind(storage),
    };
};

export const maskEmail = (email: string) =>
    email[0] + '*'.repeat(email.slice(1, email.indexOf('@')).length) + email.slice(email.indexOf('@'));
