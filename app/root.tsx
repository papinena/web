import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import useWindowSize from "./hooks/useWindowsSize";
import { MOBILE_BREAKPOINT } from "./utils/constants";
import { Text } from "./components/ui/text";
import { TanstackQueryProvider } from "./query-client";
import "~/utils/sentry";
import { SentryErrorBoundary } from "~/utils/sentry";
import { App } from "./routes/app";

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
    <SentryErrorBoundary>
      <TanstackQueryProvider>
        <App />
      </TanstackQueryProvider>
    </SentryErrorBoundary>
  );
}
