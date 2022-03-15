CREATE MIGRATION m1qfwry7syxhz3yxkd6c462kgiw4bzzkuhjfztqo5fxtmshrpfkkuq
    ONTO m1c2n4zecepgmdto4hi7qgxivoknpzap5vmcw4rot4z53h2trfxw4a
{
  ALTER TYPE default::Contact {
      CREATE PROPERTY has_grp := ((default::Contact.grp IS TYPEOF default::Contact.grp));
  };
};
