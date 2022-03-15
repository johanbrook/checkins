CREATE MIGRATION m1b24bmsqqwjfq56qdebz24ynpkubq7z3spvpphlkp5uwwrttkffma
    ONTO m1dbn2dkzmsj66efkv2tfqt6ghiqawfzqaacrotbm2vmtfjv2twfqa
{
  ALTER TYPE default::Friend {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::expression ON ((__subject__ = std::str_trim(__subject__)));
      };
  };
};
