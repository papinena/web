import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";
import { useAuth } from "~/hooks/useAuth";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Box className="bg-gray-200 min-h-dvh flex h-full w-full p-3 flex-col px-5 py-3 gap-3">
      <Outlet />
      <Footer className="ml-auto" />
    </Box>
  );
}
