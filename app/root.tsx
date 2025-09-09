import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import useWindowSize from "./hooks/useWindowsSize";
import { MOBILE_BREAKPOINT } from "./utils/constants";
import { Text } from "./components/ui/text";
import { TanstackQueryProvider } from "./query-client";
import "~/utils/sentry";
import { App } from "./routes/app";
import { ToastManager } from "./components/toast-manager";
import { GoogleOAuthProvider } from "@react-oauth/google";

export { ErrorBoundary } from "./components/sentry-error-boundary";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/favicons/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicons/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicons/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/favicons/android-chrome-192x192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/favicons/android-chrome-512x512.png",
  },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "shortcut icon", href: "/favicons/favicon.ico" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const { width } = useWindowSize();

  if (width > MOBILE_BREAKPOINT) {
    return <Text>Works better in mobile screens</Text>;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <TanstackQueryProvider>
        <App />
        <ToastManager />
      </TanstackQueryProvider>
    </GoogleOAuthProvider>
  );
}
