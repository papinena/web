export function loader() {
  return {
    applinks: {
      details: [
        {
          appIDs: ["297N2ZQLB4.com.vizis"],
          components: [
            {
              "/": "/*",
              comment: "Matches any URL whose path starts with /",
            },
          ],
        },
      ],
    },
    webcredentials: {
      apps: ["297N2ZQLB4.com.vizis"],
    },

    appclips: {
      apps: ["297N2ZQLB4.com.vizis"],
    },
  };
}
