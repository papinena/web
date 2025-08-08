import { Link, Outlet, redirect } from "react-router";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";
import { Header } from "~/components/header";
import { authUtils } from "~/utils/auth";
import { getImageReadToken } from "~/services/get-image-read-token";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const isLoginPage = url.pathname === "/login";
  const isRegisterPage = url.pathname.startsWith("/register");
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
    return redirect("/login");
  }

  if (!isAuthenticated) return null;

  const storedImageReadToken = localStorage.getItem("image-read-token");

  if (!storedImageReadToken) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      throw error;
    }

    localStorage.setItem("image-read-token", JSON.stringify(data));

    return null;
  }

  const imageReadToken = JSON.parse(storedImageReadToken);

  if (new Date() > new Date(imageReadToken.expiresOn)) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      throw error;
    }

    localStorage.setItem("image-read-token", JSON.stringify(data));
  }

  return null;
};

export function App() {
  const { isAuthenticated, authData } = useAuth();
  const isAuth = isAuthenticated();
  const isEmployee = authData?.userType === "employee";
  const to = isEmployee ? "/admin/new-post" : "/user/new-post";

  return (
    <>
      <Header />
      <Box className="bg-gray-200 min-h-dvh flex h-full w-full p-3 flex-col px-5 py-3 gap-3">
        <Outlet />
        <Footer className="ml-auto" />
      </Box>
      <Box>
        <Box className="bg-white min-h-12 relative w-full items-center justify-center">
          {isAuth && (
            <Button
              asChild
              variant={"outline"}
              className="size-14 absolute rounded-full bottom-3"
            >
              <Link to={to ?? null}>
                <PlusIcon color={"#94C56F"} className="size-14" />
              </Link>
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
