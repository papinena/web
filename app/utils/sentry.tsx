import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://c8c2ab88ba4b557a7c0050d1dfe48749@o4509481423863808.ingest.us.sentry.io/4509604794466304",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  integrations: [],
});
