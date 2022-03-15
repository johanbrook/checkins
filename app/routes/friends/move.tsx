import { ActionFunction } from "custom.env";
import { redirect, Form } from "remix";
import { Frequency } from "~/types.server";

export const action: ActionFunction = async ({ request: req, context }) => {
    const { id: userId } = await context.auth.isAuthenticated(req, { failureRedirect: '/login' });

    const body = await req.formData();
    const friendId = body.get('friendId')?.toString();
    const groupId = body.get('groupId')?.toString();

    if (!friendId || !groupId) {
        throw new Response('Did not get "friendId" or "groupId".', {
            status: 400
        });
    }

    await context.model.moveFriend(friendId, groupId, userId);

    return redirect('/');
};

export const MoveFriendForm = ({ friend, groups }: { friend: { id: string }, groups: Array<{ id: string, freq: Frequency }> }) => (
    <Form method="post" action="/friends/move">
        <input type="hidden" name="friendId" value={friend.id} />
        <select name="groupId" required>
            {groups.map(gr => (
                <option value={gr.id} key={gr.id}>{gr.freq}</option>
            ))}
        </select>
        <input type="submit" value="Move" />
    </Form>
);
