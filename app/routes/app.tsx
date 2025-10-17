import { Link, Outlet, redirect } from "react-router";
import { Box } from "~/components/ui/box";
import { Header } from "~/components/header";
import { authUtils } from "~/utils/auth";
import { getImageReadToken } from "~/services/get-image-read-token";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";
import { firebaseService } from "~/lib/firebase";
import { useImageTokenStore } from "~/stores/image-token";
import { FIRST_ACCESS_KEY } from "~/utils/constants";
import { saveFcmToken } from "~/services/save-fcm-token";
import * as Sentry from "@sentry/react";
import { sendUserIdToNative } from "~/utils/send-user-id-to-native";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const isLoginPage = ["/user/login", "/admin/login"].includes(url.pathname);
  const isRegisterPage = url.pathname.startsWith("/register");
  const isAuthenticated = authUtils.isAuthenticated();
  const authData = authUtils.getAuthData();
  const hasVisited = localStorage.getItem(FIRST_ACCESS_KEY);

  if (!hasVisited) {
    localStorage.setItem(FIRST_ACCESS_KEY, "true");
    return redirect("/register/user");
  }

  let notificationToken = null;

  if (isAuthenticated) {
    notificationToken = await firebaseService.setup();
  } else {
    await firebaseService.setupForUnauthenticatedUser();
  }

  if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
    return redirect("/user/login");
  }

  if (!isAuthenticated) return null;

  if (!notificationToken) {
    Sentry.captureMessage("Unable to save notification token");
  } else {
    await saveFcmToken(notificationToken);
  }

  await sendUserIdToNative();

  const { expiresOn, sasToken, setToken } = useImageTokenStore.getState();
  const isTokenExpired = !expiresOn || new Date() > new Date(expiresOn);

  if (!sasToken || isTokenExpired) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      // Handle the error appropriately, maybe redirect to an error page
      // or log the user out if the token is critical.
      console.error("Failed to refresh image read token:", error);
    } else {
      setToken(data);
    }
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
    <Box className="min-h-dvh max-w-4xl w-full mx-auto relative h-full flex-col">
      <Header />
      <Box className="flex-1 mb-10 flex flex-col">
        <Outlet />
      </Box>
      <Box className="bg-white bottom-0 fixed min-h-12 w-full max-w-4xl items-center justify-center">
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
