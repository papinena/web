import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { ErrorMessage } from "~/components/error-message";
import { PasswordInput } from "~/components/password-input";
import { resetPassword } from "~/services/reset-password";

export const ResetPasswordSchema = z
  .object({
    email: z.email({ message: "Por favor, insira um e-mail válido." }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export default function ResetPassword() {
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [search] = useSearchParams();
  const token = search.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (result) => {
      if (result.error) {
        setFormMessage({ type: "error", message: result.error.message });
      } else {
        setFormMessage({
          type: "success",
          message:
            "Sua senha foi redefinida com sucesso! Você já pode fazer o login.",
        });
      }
    },
    onError: (error) => {
      setFormMessage({ type: "error", message: error.message });
    },
  });

  const onSubmit = (data: ResetPasswordType) => {
    if (!token) {
      setFormMessage({
        type: "error",
        message: "Token de redefinição inválido ou ausente.",
      });
      return;
    }
    setFormMessage(null);
    mutation.mutate({ ...data, token });
  };

  return (
    <Box className="flex-1 h-full w-full flex items-center justify-center p-5">
      <Box className="w-full flex-col max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Box className="text-center flex-col">
          <Text variant="title">Redefinir sua Senha</Text>
          <Text className="mt-2 text-gray-600">
            Digite seu e-mail e a nova senha abaixo.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="Nova Senha"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            <ErrorMessage show={!!errors.password}>
              {errors.password?.message}
            </ErrorMessage>
          </Box>

          <Box className="flex flex-col gap-1">
            <PasswordInput
              placeholder="Confirme a Nova Senha"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <ErrorMessage show={!!errors.confirmPassword}>
              {errors.confirmPassword?.message}
            </ErrorMessage>
          </Box>

          {formMessage && (
            <Box
              className={`p-3 rounded-md ${
                formMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <Text>{formMessage.message}</Text>
            </Box>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Box className="flex items-center gap-2">
                <Spinner size="sm" />
                <Text>Redefinindo...</Text>
              </Box>
            ) : (
              "Redefinir Senha"
            )}
          </Button>
        </form>

        {formMessage?.type === "success" && (
          <Box className="mx-auto text-center">
            <Link
              to="/login"
              className="text-sm text-blue-primary hover:underline"
            >
              Ir para o Login
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}
