import { Outlet } from "react-router";
import { Footer } from "~/components/footer";
import { Box } from "~/components/ui/box";

export default function RegisterLayout() {
  return (
    <Box className="bg-gray-200 min-h-dvh flex h-full w-full p-3 flex-col px-5 py-3 gap-3">
      <Outlet />
      <Footer className="ml-auto" />
    </Box>
  );
}
