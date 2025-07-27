import { Outlet } from "react-router";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";
import { useAuth } from "~/hooks/useAuth";
import { Header } from "~/components/header";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      <Box className="bg-gray-200 min-h-dvh flex h-full w-full p-3 flex-col px-5 py-3 gap-3">
        <Outlet />
        <Footer className="ml-auto" />
      </Box>
    </>
  );
}
