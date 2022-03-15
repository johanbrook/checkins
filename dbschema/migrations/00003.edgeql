CREATE MIGRATION m1fse57hjkh43rvap24cfduz5b4uzxm5zqjcm364ryhzqihcjloehq
    ONTO m1czvqqvsc5dh4mjczrihtsggamfc5ra4usqu2glnnjaylcsggiy5a
{
  ALTER TYPE default::Grp {
      CREATE MULTI LINK contacts := (.<grp[IS default::Contact]);
  };
};
