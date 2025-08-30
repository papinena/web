import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { ErrorMessage } from "~/components/error-message";
import { PasswordInput } from "~/components/password-input";
import { login } from "~/services/login";
import { LoginSchema, type LoginType } from "~/parsers/login";
import { useAuth } from "~/hooks/useAuth";
import { Separator } from "~/components/ui/separator";
import { firebaseService } from "~/lib/firebase";
import { saveFcmToken } from "~/services/save-fcm-token";
import { RouteContainer } from "~/components/route-container";
import { BoxWithImage } from "~/components/register/box-with-image";
import { useGoogleLogin } from "@react-oauth/google";
import { socialLogin } from "~/services/social-login";
import { GoogleIcon } from "~/components/google-icon";
import { EmployeeMapper } from "~/mappers/employee";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formError, setFormError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { error, data } = await login(credentials);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result: any) => {
      if (result.error) {
        setFormError(result.error.message);
        return;
      }

      const isEmployee = result.userType === "employee";
      const isUser = result.userType === "user";
      authLogin(result);

      if (isEmployee && !result.employee.is_register_completed) {
        return navigate("/register/admin/fulfill", {
          state: { ...result, employee: EmployeeMapper.toUI(result.employee) },
        });
      }

      // Store authentication data in localStorage and update state
      const token = await firebaseService.setup();

      if (token) {
        await saveFcmToken(token);
      }

      if (isEmployee) {
        return navigate("/admin/dashboard");
      }

      if (isUser) {
        return navigate("/");
      }
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const { error, data } = await socialLogin(token);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (result: any) => {
      if (result.error) {
        setFormError(result.error.message);
      } else {
        if (result.isNew) {
          return navigate("/register/user/social/form", {
            state: { ...result.profile },
          });
        }
        // Store authentication data in localStorage and update state
        authLogin(result);
        const token = await firebaseService.setup();

        if (token) {
          await saveFcmToken(token);
        }

        if (result.userType === "employee") {
          return navigate("/admin/dashboard");
        }

        if (result.userType === "user") {
          return navigate("/");
        }

        // Redirect to dashboard or home page
        // You can change this to the appropriate route
      }
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      socialLoginMutation.mutate(tokenResponse.access_token);
    },
    onError: () => {
      setFormError("Failed to login with Google");
    },
  });

  const onSubmit = (data: LoginType) => {
    setFormError("");
    loginMutation.mutate(data);
  };

  return (
    <RouteContainer>
      <BoxWithImage
        imageContainerClassName="-mt-18"
        images={<Image className="w-full" src="/Group 55.svg" />}
      >
        <Text className="font-bold mr-auto font-lg">Acesse sua conta</Text>
        <Box className="w-full justify-center">
          <Button
            type="button"
            variant={"outline"}
            className="w-fit cursor-pointer"
            onClick={() => googleLogin()}
            disabled={socialLoginMutation.isPending}
          >
            {socialLoginMutation.isPending ? (
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
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <Box className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              {...register("email")}
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
            className="bg-blue-primary max-w-72 mx-auto w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Box className="flex items-center gap-2">
                <Spinner size="sm" />
                <Text>Entrando...</Text>
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
