import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { ErrorMessage } from "~/components/error-message";
import { forgotPassword } from "~/services/forgot-password";

const ForgotPasswordSchema = z.object({
  email: z.email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
});

type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (result) => {
      if (result.error) {
        setFormMessage({ type: "error", message: result.error.message });
      } else {
        setFormMessage({
          type: "success",
          message:
            "Se uma conta com esse e-mail existir, um link para redefinir a senha foi enviado.",
        });
      }
    },
    onError: (error) => {
      setFormMessage({ type: "error", message: error.message });
    },
  });

  const onSubmit = (data: ForgotPasswordType) => {
    setFormMessage(null);
    mutation.mutate(data);
  };

  return (
    <Box className="flex-1 h-full w-full flex items-center justify-center p-5">
      <Box className="w-full flex-col max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <Box className="text-center flex-col">
          <Text variant="title">Esqueceu a senha?</Text>
          <Text className="mt-2 text-gray-600">
            Sem problemas. Insira seu endereço de e-mail abaixo e nós lhe
            enviaremos um link para redefini-la.
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

          {formMessage && (
            <Box
              className={`p-3 text-center rounded-md ${
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
                <Text>Enviando...</Text>
              </Box>
            ) : (
              "Enviar Link de Redefinição"
            )}
          </Button>
        </form>

        <Link
          to="/login"
          className="text-sm mx-auto text-blue-primary hover:underline"
        >
          Voltar para o Login
        </Link>
      </Box>
    </Box>
  );
}
