import { useNavigate, useRouteError } from "react-router";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/stores/auth";

export function ErrorBoundary() {
  const error = useRouteError();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  function onClick() {
    logout();
    navigate("/login");
  }

  console.error(error);

  const errorMessage =
    error instanceof Error ? error.message : "Um erro inesperado aconteceu.";

  return (
    <Box className="flex w-full flex-1 min-h-dvh flex-col items-center justify-center h-full p-4 bg-red-50 text-red-700">
      <Text variant="title">Algo deu errado</Text>
      <Text>Nós já fomos notificados do erro.</Text>
      <pre className="mt-4 text-center p-2 bg-red-100 rounded text-wrap break-words">
        {errorMessage}
      </pre>
      <Button variant="destructive" onClick={onClick} className="mt-4">
        Ir para o Login
      </Button>
    </Box>
  );
}
