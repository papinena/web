import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "~/parsers/create-user";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "~/services/create-user";

export function useUserForm() {
  const methods = useForm({
    resolver: zodResolver(CreateUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
  });

  const onSave = methods.handleSubmit((data) => {
    mutate(data);
  });

  return {
    methods,
    onSave,
    isPending,
  };
}
