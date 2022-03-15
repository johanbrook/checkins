CREATE MIGRATION m13gqukoyfgonno23ydhuikyr7dqlkg2j2wair6gdhx7xmnfyvdb7a
    ONTO m1wabt6ugchdtu2dp6srnvwediypai7suhqexeln33gwwshtre3hna
{
  ALTER TYPE default::Friend {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
  ALTER TYPE default::Grp {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
};
