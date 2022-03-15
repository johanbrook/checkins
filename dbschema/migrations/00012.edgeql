CREATE MIGRATION m1wabt6ugchdtu2dp6srnvwediypai7suhqexeln33gwwshtre3hna
    ONTO m1wgz2xctqyj7hmm7tmx3bmegplukozcxt7jjoklccsfexerjudnpa
{
  ALTER TYPE default::Friend {
      CREATE REQUIRED LINK user -> default::User {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::Grp {
      CREATE REQUIRED LINK user -> default::User {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK friends := (.<user[IS default::Friend]);
      CREATE MULTI LINK groups := (.<user[IS default::Grp]);
  };
};
