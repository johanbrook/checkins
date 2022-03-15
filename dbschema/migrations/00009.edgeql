CREATE MIGRATION m1dbn2dkzmsj66efkv2tfqt6ghiqawfzqaacrotbm2vmtfjv2twfqa
    ONTO m1ung7xdp3ewtnp6s5lpk2if63tnw323cjhdejbdrc37mogngah7hq
{
  ALTER SCALAR TYPE default::Recurr RENAME TO default::Frequency;
  ALTER TYPE default::Grp {
      ALTER PROPERTY recurr {
          RENAME TO freq;
      };
  };
};
