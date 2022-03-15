CREATE MIGRATION m1ung7xdp3ewtnp6s5lpk2if63tnw323cjhdejbdrc37mogngah7hq
    ONTO m1afrw4v2qhus3exaxwig5udw6j54iulrk47746wggmpg42h2kbs2a
{
  ALTER TYPE default::Grp {
      DROP LINK contacts;
  };
  ALTER TYPE default::Contact RENAME TO default::Friend;
  ALTER TYPE default::Grp {
      CREATE MULTI LINK friends := (.<grp[IS default::Friend]);
  };
};
