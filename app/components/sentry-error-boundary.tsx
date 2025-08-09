import { Link, useRouteError } from "react-router";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { authUtils } from "~/utils/auth";

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const handleGoToLogin = () => {
    authUtils.clearAuth();
  };

  const errorMessage =
    error instanceof Error ? error.message : "Um erro inesperado aconteceu.";

  return (
    <Box className="flex w-full flex-1 min-h-dvh flex-col items-center justify-center h-full p-4 bg-red-50 text-red-700">
      <Text variant="title">Algo deu errado</Text>
      <Text>Nós já fomos notificados do erro.</Text>
      <pre className="mt-4 text-center p-2 bg-red-100 rounded text-wrap break-words">
        {errorMessage}
      </pre>
      <Button asChild variant="destructive" className="mt-4">
        <Link to="/login" onClick={handleGoToLogin}>
          Ir para o Login
        </Link>
      </Button>
    </Box>
  );
}
