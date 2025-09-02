import { Link } from "react-router";
import { RouteContainer } from "~/components/route-container";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AdminEmployeesIndex() {
  return (
    <RouteContainer>
      <Button variant={"admin"} asChild>
        <Link to="add">
          <Text className="text-neutral-200">Adicionar novo funcionário</Text>
        </Link>
      </Button>
      <Button variant={"admin"} asChild>
        <Link to="manage">
          <Text className="text-neutral-200">Gerenciar funcionários</Text>
        </Link>
      </Button>
    </RouteContainer>
  );
}
