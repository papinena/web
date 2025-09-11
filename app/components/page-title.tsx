import type { ReactNode } from "react";
import { Text } from "./ui/text";

export function PageTitle({ children }: { children: ReactNode }) {
  return <Text className="text-lg font-bold">{children}</Text>;
}
