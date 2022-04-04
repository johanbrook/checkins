module default {
    scalar type Frequency extending enum<Daily, Weekly, Monthly, HalfYearly, Yearly>;

    type Friend {
        required property name -> str {
            constraint expression on (
                __subject__ = str_trim(__subject__)
            );
        };

        required property createdAt -> datetime {
            default := datetime_current();
            readonly := true;
        };

        link grp -> Grp {
            on target delete allow;
        };

        required link user -> User;
    }

    # "Group" is a reserved word, so "Grp" it is
    type Grp {
        required property freq -> Frequency {
            constraint exclusive;
        };

        required property createdAt -> datetime {
            default := datetime_current();
            readonly := true;
        };

        required link user -> User;

        # Computed
        multi link friends := .< grp[is Friend]
    }

    type User {

        # Publically seen in calendar links. Can be rotated.
        required property slug -> str {
            constraint exclusive;
            constraint expression on (
                __subject__ = str_trim(__subject__)
            );
        }

        required property email -> str {
            constraint exclusive;
        }

        # A "blind index" for doing lookups on email. Note that EdgeDB
        # automatically creates an index for all unique (exclusive) constraints.
        required property email_bidx -> str {
            constraint exclusive;
        }

        required property createdAt -> datetime {
            default := datetime_current();
            readonly := true;
        };

        # Computed
        multi link groups := .< user[is Grp];
        multi link friends := .< user[is Friend];
    }
}
