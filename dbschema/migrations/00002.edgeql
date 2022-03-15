CREATE MIGRATION m1czvqqvsc5dh4mjczrihtsggamfc5ra4usqu2glnnjaylcsggiy5a
    ONTO m1d6rosfi42u7tsmkvldrwikwvvaejpm5npd6gchgdiin2uf2sohnq
{
  CREATE SCALAR TYPE default::Recurr EXTENDING enum<Daily, Weekly, Monthly, HalfYearly, Yearly>;
  CREATE TYPE default::Grp {
      CREATE REQUIRED PROPERTY label -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY recurr -> default::Recurr {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Contact {
      CREATE REQUIRED LINK grp -> default::Grp {
          SET REQUIRED USING (SELECT
              default::Grp 
          LIMIT
              1
          );
      };
  };
};
