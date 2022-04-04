import { ActionFunction } from 'custom.env';
import { redirect } from 'remix';

export const action: ActionFunction = async ({ request: req, context }) => {
    const { id: userId } = await context.auth.isAuthenticated(req, { failureRedirect: '/login' });

    const body = await req.formData();
    const groupId = body.get('groupId')?.toString();

    if (!groupId) {
        throw new Response('Did not get "groupId".', {
            status: 400,
        });
    }

    try {
        await context.model.deleteGroup(groupId, userId);
    } catch (err) {
        console.error(err);
        throw new Response('An error occurred when deleting the group', {
            status: 500,
        });
    }

    return redirect('/');
};
