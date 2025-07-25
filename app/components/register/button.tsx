import { Link } from "react-router";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export function Button({ className }: { className?: string }) {
  return (
    <Link
      className={cn("rounded-sm flex p-2 mx-5 justify-center", className)}
      to={"./form"}
    >
      <Text className="font-normal text-white">Cadastre-se já!</Text>
    </Link>
  );
}
