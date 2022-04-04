import { ActionFunction } from 'custom.env';
import { redirect } from 'remix';

export const action: ActionFunction = async ({ request: req, context }) => {
    const { id: userId } = await context.auth.isAuthenticated(req, { failureRedirect: '/login' });

    const body = await req.formData();
    const friendId = body.get('friendId')?.toString();

    if (!friendId) {
        throw new Response('Did not get "friendId".', {
            status: 400,
        });
    }

    await context.model.deleteFriend(friendId, userId);

    return redirect('/');
};
