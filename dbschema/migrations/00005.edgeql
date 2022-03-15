CREATE MIGRATION m1c2n4zecepgmdto4hi7qgxivoknpzap5vmcw4rot4z53h2trfxw4a
    ONTO m1ce6zlv4gki66lz7n4aibbarauogah6so446fa3bvmxulomj7oara
{
  ALTER TYPE default::Contact {
      ALTER LINK grp {
          ON TARGET DELETE  ALLOW;
          RESET OPTIONALITY;
      };
  };
};
