import type { ReactNode } from "react";
import { Box } from "./ui/box";

export function SectionContainer({ children }: { children: ReactNode }) {
  return <Box className="flex-col gap-3">{children}</Box>;
}
