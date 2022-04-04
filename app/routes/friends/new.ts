import { ActionFunction } from 'custom.env';
import { redirect } from 'remix';

export const action: ActionFunction = async ({ request: req, context }) => {
    const { id: userId } = await context.auth.isAuthenticated(req, { failureRedirect: '/login' });

    const body = await req.formData();

    const name = body.get('name')?.toString();
    const groupId = body.get('groupId')?.toString();

    if (!name) throw new Response('Did not get "name"', { status: 400 });
    if (!groupId) throw new Response('Did not get "groupId"', { status: 400 });

    await context.model.createFriend(name, groupId, userId);

    return redirect('/');
};
