import { LoaderFunction } from "custom.env";
import { Form, Link, useLoaderData, useTransition } from "remix";
import { type Context } from "server";
import { FindGroups, User } from "~/data.server";
import { MoveFriendForm } from "./friends/move";

type LoaderData = FindGroups & { user: User };

export const loader: LoaderFunction<LoaderData, Context> = async ({ request, context }) => {
    const { id } = await context.auth.isAuthenticated(request, { failureRedirect: '/login' });
    const groupsData = await context.model.findGroups(id);
    const user = await context.model.findUserById(id);

    if (!user) {
        throw new Response('Cannot find current user in database', {
            status: 404
        });
    }

    return {
        ...groupsData,
        user,
    };
};

export default function Index() {
    const { groups, friendsWithoutGroup, user } = useLoaderData<LoaderData>();
    const transition = useTransition();

    const existingFreqs = groups.map(g => g.freq);
    const frequencies = (['Daily', 'Weekly', 'Monthly', 'HalfYearly', 'Yearly'] as const)
        .filter(s => !existingFreqs.includes(s));

    return (
        <main>
            <header className="flex justify-between items-center">
                <h1>Checkins</h1>
                <div>
                    <form method="post" action="/logout">
                        <button>Log out</button>
                    </form>
                </div>
            </header>

            <p>Hi {user.email}!</p>

            <Link to={`/users/${user.id}/feed.ics`} reloadDocument>Generate .ics</Link>

            {groups.map(g => (
                <section key={g.id}>
                    <header className="flex items-center justify-between">
                        <h2 className="no-margin">{g.freq}</h2>
                        <Form method="post" action="/groups/delete">
                            <input type="hidden" name="groupId" value={g.id} />
                            <input type="submit" value="Delete" />
                        </Form>
                    </header>
                    <ul>
                        {g.friends.map(c => (
                            <li key={c.id}>
                                <span>{c.name}</span>
                                <Form method="post" action="/friends/delete">
                                    <input type="hidden" name="friendId" value={c.id} />
                                    <input type="submit" value="Delete" />
                                </Form>
                                {groups.filter(gr => gr.id != g.id).length > 0 && (
                                    <MoveFriendForm friend={c} groups={groups.filter(gr => gr.id != g.id)} />
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            <section>
                <h3>Friends without group</h3>

                <ul>
                    {friendsWithoutGroup.map(c => (
                        <li key={c.id}>
                            <span>{c.name}</span>
                            <Form method="post" action="/friends/delete">
                                <input type="hidden" name="friendId" value={c.id} />
                                <input type="submit" value="Delete" />
                            </Form>
                            <MoveFriendForm friend={c} groups={groups} />
                        </li>
                    ))}
                </ul>
            </section>

            <Form method="post" action="/friends/new">
                <h3>New friend</h3>
                <input type="text" name="name" placeholder="Name…" required />
                <select name="groupId" required>
                    {groups.map(g => (
                        <option value={g.id} key={g.id}>{g.freq}</option>
                    ))}
                </select>
                <input
                    type="submit"
                    value={transition.state == 'submitting' ? 'Creating…' : 'Create'}
                    disabled={transition.state == 'submitting'} />
            </Form>

            {frequencies.length > 0 && <Form method="post" action="/groups/new">
                <h3>New group</h3>
                <select name="freq" required>
                    {frequencies.map(r => (
                        <option value={r} key={r}>{r}</option>
                    ))}
                </select>
                <input
                    type="submit"
                    value={transition.state == 'submitting' ? 'Creating…' : 'Create'}
                    disabled={transition.state == 'submitting'} />
            </Form>}
        </main >
    );
}

