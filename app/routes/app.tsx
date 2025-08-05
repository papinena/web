import { Outlet, redirect } from "react-router";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";
import { Header } from "~/components/header";
import { authUtils } from "~/utils/auth";
import { getImageReadToken } from "~/services/get-image-read-token";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const isLoginPage = url.pathname === "/login";
  const isRegisterPage = url.pathname.startsWith("/register");
  const isAuthenticated = authUtils.isAuthenticated();

  if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
    return redirect("/login");
  }

  if (!isAuthenticated) return null;

  const imageReadToken = JSON.parse(
    localStorage.getItem("image-read-token") ?? ""
  );

  if (!imageReadToken) {
    const { data, error } = await getImageReadToken();

    if (error || !data) {
      throw error;
    }

    localStorage.setItem("image-read-token", JSON.stringify(data));
  }

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
