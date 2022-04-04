CREATE MIGRATION m1vfrnid2sxrcgedluswppybac3tyzjozg3rco5svdg5ijocnqwf5q
    ONTO m1xaxqcv4c5p2wjfnccaqdywwf6i5uk3c5zhtk5iaflaajbhfkudha
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY slug -> std::str {
          SET REQUIRED USING (SELECT
              'johan'
          );
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::expression ON ((__subject__ = std::str_trim(__subject__)));
      };
  };
};
