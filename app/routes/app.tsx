import { Link, Outlet, redirect } from "react-router";
import { Box } from "~/components/ui/box";
import { Header } from "~/components/header";
import { authUtils } from "~/utils/auth";
import { getImageReadToken } from "~/services/get-image-read-token";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";
import { firebaseService } from "~/lib/firebase";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const isLoginPage = ["/user/login", "/admin/login"].includes(url.pathname);
  const isRegisterPage = url.pathname.startsWith("/register");
  const isAuthenticated = authUtils.isAuthenticated();
  const authData = authUtils.getAuthData();

  await firebaseService.setupForUnauthenticatedUser();

  if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
    return redirect("/user/login");
  }

  if (!isAuthenticated) return null;

  await firebaseService.setup();

  let storedImageReadToken = localStorage.getItem("image-read-token");

  if (!storedImageReadToken) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      throw error;
    }

    storedImageReadToken = JSON.stringify(data);
    localStorage.setItem("image-read-token", storedImageReadToken);
  }

  const imageReadToken = JSON.parse(storedImageReadToken);

  if (new Date() > new Date(imageReadToken.expiresOn)) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      throw error;
    }

    storedImageReadToken = JSON.stringify(data);
    localStorage.setItem("image-read-token", storedImageReadToken);
  }

  const isFulFillPage = url.pathname.endsWith("fulfill");

  if (!isFulFillPage && (isLoginPage || isRegisterPage)) {
    if (authData?.userType === "user") return redirect("/");
    if (authData?.userType === "employee") return redirect("/admin/dashboard");
  }

  return null;
};

export function App() {
  const { isAuthenticated, authData } = useAuth();
  const isAuth = isAuthenticated();
  const isEmployee = authData?.userType === "employee";
  const to = isEmployee ? "/post/admin/create" : "/post/create";

  return (
    <Box className="min-h-dvh w-full h-full flex-col">
      <Header />
      <Box className="flex-1 flex flex-col">
        <Outlet />
      </Box>
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
  );
}
