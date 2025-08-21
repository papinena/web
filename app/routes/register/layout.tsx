import { Outlet } from "react-router";
import { RouteContainer } from "~/components/route-container";

export default function RegisterLayout() {
  return (
    <RouteContainer>
      <Outlet />
    </RouteContainer>
  );
}
