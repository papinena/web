import type { ReactNode } from "react";
import { Text } from "../ui/text";

export function LoginTitle({ children }: { children?: ReactNode }) {
  return (
    <Text variant="title" className="font-bold mr-auto">
      {children ?? "Acesse sua conta"}
    </Text>
  );
}
