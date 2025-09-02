import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { Widget } from "~/components/ui/widget";
import { RouteContainer } from "~/components/route-container";

export default function Dashboard() {
  const { authData } = useAuth();

  const employee = authData?.employee;

  const iconClassName = "size-9";

  return (
    <RouteContainer>
      <Box className="flex-1">
        <Box className="flex-col gap-5">
          <Widget className="border-green-primary">
            <Widget.Title className="font-bold">
              Painel de controle da Administração
            </Widget.Title>
            <Text>
              Olá,
              <strong className="text-blue-primary">@{employee?.name}</strong>,
              por aqui você pode acessar todas as informações relacionadas a
              conta do condomínio!
            </Text>
          </Widget>
          {
            <Link to="/admin/edit">
              <Widget className="border-green-primary">
                <Widget.Title
                  className=""
                  icon={
                    <Image src="/image 113.svg" className={iconClassName} />
                  }
                >
                  Cadastro da Administração
                </Widget.Title>
                <Text>
                  Edite, remova ou inclua novas informações sobre a
                  administração do condomínio
                </Text>
              </Widget>
            </Link>
          }
          <Link to="/admin/residents">
            <Widget className="border-green-primary">
              <Widget.Title
                icon={<Image src="/image 113.svg" className={iconClassName} />}
              >
                Gerenciar moradores
              </Widget.Title>
              <Text>Aprove ou remova os moradores do seu condomínio</Text>
            </Widget>
          </Link>
          {employee?.permission === "ADMIN" && (
            <Link to="/admin/employees">
              <Widget className="border-green-primary">
                <Widget.Title
                  icon={
                    <Image src="/image 113.svg" className={iconClassName} />
                  }
                >
                  Gerenciar Equipe Administração
                </Widget.Title>
                <Text>
                  Inclua ou remova funcionários aptos a publicar em nome do
                  condomínio.
                </Text>
              </Widget>
            </Link>
          )}
          <Widget className="border-green-primary">
            <Widget.Title
              icon={<Image src="/image 112.svg" className={iconClassName} />}
            >
              Postagens do Condomínio
            </Widget.Title>
            <Text>Visualize, altere ou remova as postagens.</Text>
          </Widget>
        </Box>
      </Box>
    </RouteContainer>
  );
}
