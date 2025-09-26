import { RouteContainer } from "./route-container";
import { Spinner } from "./ui/spinner";

export function Loading() {
  return (
    <RouteContainer className="items-center justify-center">
      <Spinner />
    </RouteContainer>
  );
}
