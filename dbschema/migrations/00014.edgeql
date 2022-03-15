CREATE MIGRATION m1xaxqcv4c5p2wjfnccaqdywwf6i5uk3c5zhtk5iaflaajbhfkudha
    ONTO m13gqukoyfgonno23ydhuikyr7dqlkg2j2wair6gdhx7xmnfyvdb7a
{
  ALTER TYPE default::Grp {
      DROP PROPERTY label;
  };
  DROP SCALAR TYPE default::Label;
};
