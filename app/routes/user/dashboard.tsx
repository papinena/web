import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { Widget } from "~/components/ui/widget";

export default function Dashboard() {
  const { authData } = useAuth();

  const iconClassName = "size-9";

  const user = authData?.user;

  return (
    <Box className="flex-1">
      <Box className="flex-col gap-5">
        <Widget>
          <Widget.Title className="font-bold">
            Seu painel de controle
          </Widget.Title>
          <Text>
            Olá,
            <strong className="text-blue-primary">@{user?.name}</strong>, por
            aqui você pode acessar todas as informações relacionadas à sua
            conta. :-)
          </Text>
        </Widget>
        <Link to="/user/edit">
          <Widget>
            <Widget.Title
              icon={<Image src="/image 113.svg" className={iconClassName} />}
            >
              Meu cadastro
            </Widget.Title>
            <Text>Edite, remova ou inclua novas informações sobre você.</Text>
          </Widget>
        </Link>
        <Link to="/post/my-publications">
          <Widget>
            <Widget.Title
              icon={<Image src="/image 112.svg" className={iconClassName} />}
            >
              Minhas publicações
            </Widget.Title>
            <Text>Visualize, altere ou remova as postagens.</Text>
          </Widget>
        </Link>
        <Widget>
          <Widget.Title
            icon={
              <Image
                src="/dashboard-my-condominium.svg"
                className={iconClassName}
              />
            }
          >
            Meu condomínio
          </Widget.Title>
          <Text>Conheca seu condomínio</Text>
        </Widget>
      </Box>
    </Box>
  );
}
