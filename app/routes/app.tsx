import { Outlet, redirect } from "react-router";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";
import { Header } from "~/components/header";
import { authUtils } from "~/utils/auth";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const isLoginPage = url.pathname === "/login";
  const isRegisterPage = url.pathname.startsWith("/register");

  if (!authUtils.isAuthenticated() && !isLoginPage && !isRegisterPage) {
    return redirect("/login");
  }

  return null;
};

export function App() {
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
