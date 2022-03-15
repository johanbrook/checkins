import { ActionFunction, LoaderFunction } from 'custom.env';
import { json, useLoaderData } from 'remix';
type LoaderData = { magicLinkSent: boolean, error?: string };

export const loader: LoaderFunction<LoaderData> = async ({ request, context }) => {
    await context.auth.isAuthenticated(request, { successRedirect: '/' });
    const session = await context.auth.getUserSession(request);

    return json<LoaderData>({
        magicLinkSent: session.has('auth:magiclink'),
        error: session.get('auth:error')?.message,
    }, {
        headers: {
            "Set-Cookie": await context.auth.commitSession(session),
        },
    });
}

export const action: ActionFunction = async ({ request, context }) => {
    await context.auth.authenticate('email-link', request, {
        successRedirect: '/login',
        // If this is not set, any error will be throw and the ErrorBoundary will be
        // rendered.
        failureRedirect: '/login',
    });
}

export default function Login() {
    const { magicLinkSent, error } = useLoaderData<LoaderData>();

    return (
        <form action="/login" method="POST">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>magicLinkSent: {magicLinkSent ? 'yes' : 'no'}</p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required autoFocus />
            <input type="submit" value="Send magic link" />
        </form>
    );
}
