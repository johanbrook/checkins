import { ActionFunction, LoaderFunction } from 'custom.env';
import { redirect } from 'remix';

export const action: ActionFunction = async ({ request, context }) => {
    await context.auth.logout(request, { redirectTo: '/login' });
};

export const loader: LoaderFunction = async () => {
    return redirect('/');
};
