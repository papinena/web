import { sentryVitePlugin } from "@sentry/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ngrok } from "vite-plugin-ngrok";

const { NGROK_AUTH_TOKEN } = loadEnv("", process.cwd(), "NGROK");

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "matheus-oliveira-uw",
      project: "vizis",
    }),
    ngrok({
      authtoken: NGROK_AUTH_TOKEN,
    }),
  ],
  build: {
    sourcemap: true,
  },
});
