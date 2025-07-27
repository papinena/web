import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

function Widget({ children }: { children: ReactNode }) {
  return (
    <Box className="border-2 rounded-xl gap-2 px-2 pb-5 pt-2 min-h-28 flex-col border-green-primary">
      {children}
    </Box>
  );
}
function WidgetTitle({
  children,
  className = "",
  icon,
}: {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box className="gap-1.5 items-center ">
      {icon} <Text className={cn("text-lg", className)}>{children}</Text>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { authData, logout, isEmployeeAdmin } = useAuth();

  const employee = authData?.employee;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const iconClassName = "size-9";

  return (
    <Box className="flex-1">
      <Box className="flex-col gap-5">
        <Widget>
          <WidgetTitle className="font-bold">
            Painel de controle da Administração
          </WidgetTitle>
          <Text>
            Olá,
            <strong className="text-blue-primary">@{employee?.name}</strong>,
            por aqui você pode acessar todas as informações relacionadas a conta
            do condomínio!
          </Text>
        </Widget>
        {isEmployeeAdmin && (
          <Widget>
            <WidgetTitle
              className=""
              icon={<Image src="/image 113.svg" className={iconClassName} />}
            >
              Cadastro da Administração
            </WidgetTitle>
            <Text>
              Edite, remova ou inclua novas informações sobre a administração do
              condomínio
            </Text>
          </Widget>
        )}
        <Widget>
          <WidgetTitle
            icon={<Image src="/image 113.svg" className={iconClassName} />}
          >
            Gerenciar moradores
          </WidgetTitle>
          <Text>Aprove ou remova os moradores do seu condomínio</Text>
        </Widget>
        <Widget>
          <WidgetTitle
            icon={<Image src="/image 112.svg" className={iconClassName} />}
          >
            Postagens do Condomínio
          </WidgetTitle>
          <Text>Visualize, altere ou remova as postagens.</Text>
        </Widget>
      </Box>
    </Box>
  );
}
