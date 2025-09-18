import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { ErrorMessage } from "~/components/error-message";
import { PasswordInput } from "~/components/password-input";
import { Separator } from "~/components/ui/separator";
import { RouteContainer } from "~/components/route-container";
import { BoxWithImage } from "~/components/register/box-with-image";
import { GoogleIcon } from "~/components/google-icon";
import { useLogin } from "~/hooks/use-login";
import { LoginTitle } from "~/components/login/title";

export default function Login() {
  const {
    userGoogleLogin,
    userLoginMutation,
    formError,
    methods,
    userSocialLoginMutation,
    onUserLoginSubmit,
  } = useLogin();

  const { formState, register, handleSubmit } = methods;
  const { errors } = formState;

  return (
    <RouteContainer>
      <BoxWithImage
        imageContainerClassName="-mt-18"
        images={<Image className="w-full" src="/Group 55.svg" />}
      >
        <LoginTitle />
        <Box className="w-full justify-center">
          <Button
            type="button"
            variant={"outline"}
            className="w-fit cursor-pointer"
            onClick={() => userGoogleLogin()}
            disabled={userSocialLoginMutation.isPending}
          >
            {userSocialLoginMutation.isPending ? (
              <Box className="flex items-center gap-2">
                <Spinner size="sm" />
                <Text>Entrando...</Text>
              </Box>
            ) : (
              <GoogleIcon />
            )}
          </Button>
        </Box>
        <form
          onSubmit={handleSubmit(onUserLoginSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <Box className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              {...register("email")}
              type="email"
              className={errors.email ? "border-red-500" : ""}
            />
            <ErrorMessage show={!!errors.email}>
              {errors.email?.message}
            </ErrorMessage>
          </Box>

          <Box className="flex flex-col gap-1">
            <PasswordInput
              placeholder="Senha"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            <ErrorMessage show={!!errors.password}>
              {errors.password?.message}
            </ErrorMessage>
          </Box>

          <ErrorMessage show={!!formError}>{formError}</ErrorMessage>

          <Button
            type="submit"
            className="max-w-72 mx-auto w-full"
            disabled={userLoginMutation.isPending}
          >
            {userLoginMutation.isPending ? (
              <Box className="flex items-center gap-2">
                <Spinner size="sm" />
                Entrando...
              </Box>
            ) : (
              "Entrar"
            )}
          </Button>
          <Button
            asChild
            variant={"link"}
            className="mx-auto border-blue-primary cursor-pointer"
          >
            <Link to="/password/forgot">
              <Text className="text-wrap text-gray-400">
                Esqueci minha senha
              </Text>
            </Link>
          </Button>
          <Box className="w-full h-auto items-center gap-3 max-w-76 mx-auto">
            <Separator className="flex-1" />
            <Text>ou</Text>
            <Separator className="flex-1" />
          </Box>

          <Button
            asChild
            className="max-w-72 w-full mx-auto border-blue-primary !bg-blue-primary cursor-pointer"
          >
            <Link to="/register/user">
              <Text className="text-wrap text-white">Cadastre-se</Text>
            </Link>
          </Button>
        </form>
      </BoxWithImage>
    </RouteContainer>
  );
}
