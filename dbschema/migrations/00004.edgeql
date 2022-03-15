CREATE MIGRATION m1ce6zlv4gki66lz7n4aibbarauogah6so446fa3bvmxulomj7oara
    ONTO m1fse57hjkh43rvap24cfduz5b4uzxm5zqjcm364ryhzqihcjloehq
{
  CREATE SCALAR TYPE default::Label EXTENDING std::str {
      CREATE CONSTRAINT std::max_len_value(1);
      CREATE CONSTRAINT std::regexp('[A-Z]');
  };
  ALTER TYPE default::Grp {
      ALTER PROPERTY label {
          SET TYPE default::Label;
      };
  };
};
