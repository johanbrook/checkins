CREATE MIGRATION m1wgz2xctqyj7hmm7tmx3bmegplukozcxt7jjoklccsfexerjudnpa
    ONTO m1b24bmsqqwjfq56qdebz24ynpkubq7z3spvpphlkp5uwwrttkffma
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY email_bidx -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
