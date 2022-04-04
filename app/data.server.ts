import e, { type $infer } from '../dbschema/edgeql-js'; // auto-generated
import type { EdgeDb } from './db.server';
import { decrypt, encrypt, hash } from "./crypto.server";
import { Frequency } from "./types.server";
import { getConfig } from './config.server';
import { generateRandomSlug } from './words.server';

// QUERIES

const findGroupsQuery = e.params({ userId: e.uuid }, (params) =>
    e.select({
        groups: e.select(e.Grp, (g) => ({
            id: true,
            freq: true,
            friends: {
                id: true,
                name: true
            },
            filter: e.op(g.user.id, '=', params.userId),
        })),
        friendsWithoutGroup: e.select(e.Friend, (c) => ({
            id: true,
            name: true,
            filter: e.op(
                e.op(c.user.id, '=', params.userId),
                'and',
                e.op('not', e.op('exists', c.grp))
            ),
        })),
    })
);

const findGroupsForFeedQuery = e.params({ userSlug: e.str }, (params) =>
    e.select(e.Grp, (g) => ({
        id: true,
        freq: true,
        user: {
            id: true,
        },
        friends: {
            id: true,
            name: true,
            createdAt: true,
        },
        filter: e.op(g.user.slug, '=', params.userSlug),
    })),
);

export type FindGroups = $infer<typeof findGroupsQuery>;

export type CreateFriend = $infer<typeof createFriendQuery>;

const createFriendQuery = e.params({ name: e.str, groupId: e.uuid, userId: e.uuid }, (params) => {
    const group = e.select(e.Grp, (g) => ({
        filter: e.op(g.id, '=', params.groupId),
    }));

    const user = e.select(e.User, (u) => ({
        filter: e.op(u.id, '=', params.userId),
    }));

    return e.insert(e.Friend, {
        name: params.name,
        grp: e.select(e.assert_exists(group)),
        user: e.select(e.assert_exists(user)),
    })
});

export type DeleteFriend = $infer<typeof deleteFriendQuery>;

const deleteFriendQuery = e.params({ friendId: e.uuid, userId: e.uuid }, (params) =>
    e.delete(e.Friend, (c) => ({
        filter: e.op(
            e.op(c.user.id, '=', params.userId),
            'and',
            e.op(c.id, '=', params.friendId)
        ),
    }))
);

export type CreateGroup = $infer<typeof createGroupQuery>;

const createGroupQuery = e.params({ freq: e.str, userId: e.uuid }, (params) =>
    e.insert(e.Grp, {
        freq: e.cast(e.Frequency, params.freq),
        user: e.select(e.assert_exists(e.select(e.User, (u) => ({
            filter: e.op(u.id, '=', params.userId),
        }))))
    }));

export type DeleteGroup = $infer<typeof deleteGroupQuery>;

const deleteGroupQuery = e.params({ groupId: e.uuid, userId: e.uuid }, (params) =>
    e.delete(e.Grp, (c) => ({
        filter: e.op(
            e.op(c.user.id, '=', params.userId),
            'and',
            e.op(c.id, '=', params.groupId)
        ),
    }))
);

export type MoveFriend = $infer<typeof moveFriendQuery>;

const findGroupQuery = e.params({ groupId: e.uuid, userId: e.uuid }, (params) =>
    e.select(e.Grp, (g) => ({
        filter: e.op(
            e.op(g.user.id, '=', params.userId),
            'and',
            e.op(g.id, '=', params.groupId)
        ),
    }))
);

const moveFriendQuery = e.params({ friendId: e.uuid, groupId: e.uuid }, (params) =>
    e.update(e.Friend, (c) => ({
        filter: e.op(c.id, '=', params.friendId),
        set: {
            grp: e.select(e.Grp, (g) => ({ filter: e.op(g.id, '=', params.groupId) }))
        }
    }))
);

const createUserQuery = e.params({ slug: e.str, email: e.str, email_bidx: e.str }, (params) =>
    e.insert(e.User, {
        slug: params.slug,
        email: params.email,
        email_bidx: params.email_bidx,
    })
);

export interface User {
    id: string;
    email: string;
    slug: string;
}

// ACTUAL FUNCTIONS TO RUN QUERIES (PUBLIC API)

export type Model = ReturnType<typeof createModel>;

export const createModel = (db: EdgeDb) => ({
    findGroups: (userId: string): Promise<FindGroups> =>
        findGroupsQuery.run(db, { userId }),

    findGroupsForFeed: (userSlug: string) =>
        findGroupsForFeedQuery.run(db, { userSlug }),

    createFriend: async (name: string, groupId: string, userId: string) =>
        createFriendQuery.run(db, { name, groupId, userId }),

    deleteFriend: async (friendId: string, userId: string) =>
        deleteFriendQuery.run(db, { friendId, userId }),

    createGroup: async (freq: Frequency, userId: string) =>
        createGroupQuery.run(db, { freq, userId }),

    deleteGroup: async (groupId: string, userId: string) =>
        deleteGroupQuery.run(db, { groupId, userId }),

    moveFriend: async (friendId: string, groupId: string, userId: string) => {
        const group = await findGroupQuery.run(db, { groupId, userId });

        if (!group) {
            throw new Error(`Group "${groupId}" doesn't exist!`);
        }

        return moveFriendQuery.run(db, { friendId, groupId });
    },

    findUserById: async (id: string): Promise<User | null> => {
        const user = await e.params({ id: e.uuid }, (params) =>
            e.select(e.User, (u) => ({
                id: true,
                email: true,
                slug: true,
                filter: e.op(u.id, '=', params.id),
            }))
        ).run(db, { id });

        if (!user) return null;

        const decryptedEmail = decrypt(user.email, getConfig('EMAIL_PASSPHRASE'));

        return { ...user, email: decryptedEmail };
    },

    findUserByEmail: (email: string) => findUserByEmail(db, email),

    createUserIfNotExists: async (email: string): Promise<{ id: string }> => {
        const user = await findUserByEmail(db, email);

        if (user) return { id: user.id };

        return createUserQuery.run(db, {
            slug: generateRandomSlug(),
            email: encrypt(email, getConfig('EMAIL_PASSPHRASE')),
            email_bidx: hash(email, getConfig('EMAIL_HASH_KEY')),
        });
    },

});

const findUserByEmail = (db: EdgeDb, email: string): Promise<User | null> => {
    const hashedEmail = hash(email, getConfig('EMAIL_HASH_KEY'));

    return e.params({ email: e.str }, (params) =>
        e.select(e.User, (u) => ({
            id: true,
            email: true,
            slug: true,
            filter: e.op(u.email_bidx, '=', params.email),
        }))
    ).run(db, { email: hashedEmail });
};
