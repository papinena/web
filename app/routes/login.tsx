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
    onSuccess: (result: any) => {
      if (result.error) {
        setFormError(result.error.message);
      } else {
        // Store authentication data in localStorage and update state
        authLogin(result);

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

  const onSubmit = (data: LoginType) => {
    setFormError("");
    loginMutation.mutate(data);
  };

  return (
    <Box className="flex-1 h-full w-full">
      <Box className="flex flex-1 flex-col">
        <Box className="relative items-start w-full z-1">
          <Image className="w-full" src="/Group 55.svg" />
        </Box>
        <Box className="p-5 text-center flex-col gap-5 flex rounded-2xl -mt-16 flex-1 z-1 bg-white h-full w-full">
          <Text className="font-bold mr-auto font-lg">Acesse sua conta</Text>

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
          </form>
          <Box className="w-full flex-1 items-center gap-3 max-w-76 mx-auto">
            <Separator className="flex-1" />
            <Text>ou</Text>
            <Separator className="flex-1" />
          </Box>

          <Button
            asChild
            variant={"outline"}
            className="max-w-72 mx-auto py-8 border-blue-primary cursor-pointer"
          >
            <Link to="/register/user">
              <Text className="text-wrap text-blue-primary">
                Quer um condomínio mais eficiente? Saiba como o Vizis facilita a
                sua vida!
              </Text>
            </Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
