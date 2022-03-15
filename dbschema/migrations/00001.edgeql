CREATE MIGRATION m1d6rosfi42u7tsmkvldrwikwvvaejpm5npd6gchgdiin2uf2sohnq
    ONTO initial
{
  CREATE TYPE default::Contact {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
