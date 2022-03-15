CREATE MIGRATION m1afrw4v2qhus3exaxwig5udw6j54iulrk47746wggmpg42h2kbs2a
    ONTO m1qfwry7syxhz3yxkd6c462kgiw4bzzkuhjfztqo5fxtmshrpfkkuq
{
  ALTER TYPE default::Contact {
      DROP PROPERTY has_grp;
  };
};
