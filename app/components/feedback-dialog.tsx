import { Frown, Meh, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Text } from "./ui/text";
import { Box } from "./ui/box";
import { Textarea } from "./ui/textarea";
import { ButtonWithSpinner } from "./button-with-spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "~/lib/utils";
import { ErrorMessage } from "./error-message";
import { Form } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createFeedback } from "~/services/create-feedback";
import { useToastStore } from "~/stores/toast";
import { useRef, type ComponentRef } from "react";

type Props = {
  triggerProps?: React.ComponentProps<typeof DialogPrimitive.Trigger>;
};

export const FeedbackSchema = z.object({
  rating: z.enum(["LOW", "MEDIUM", "HIGH"], {
    error: "Por favor, selecione uma opção.",
  }),
  text: z.string().optional(),
});

export type FeedbackType = z.infer<typeof FeedbackSchema>;

const feedbackOptions = [
  {
    value: "HIGH",
    icon: Smile,
    color: "var(--color-green-primary)",
  },
  { value: "MEDIUM", icon: Meh, color: "#d8b14b" },
  { value: "LOW", icon: Frown, color: "#612632" },
] as const;

export function FeedbackDialog({ triggerProps }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FeedbackType>({
    resolver: zodResolver(FeedbackSchema),
  });
  const addToast = useToastStore((s) => s.addToast);
  const ref = useRef<ComponentRef<"button">>(null);

  const selectedRating = watch("rating");
  const mutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      ref.current?.click();
      reset();
      addToast({ title: "Sucesso!", description: "Feedback salvo. Obrigado!" });
    },
  });

  const onSubmit = (data: FeedbackType) => {
    console.log("Feedback submitted:", data);
    mutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild {...triggerProps}>
        <Button ref={ref} className="size-fit !p-1.5">
          <Smile className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-80">
        <DialogHeader>
          <DialogTitle>Nos ajude a melhorar o Vizis para você!</DialogTitle>
          <DialogDescription>
            <Text>O que você está achando do Vizis?</Text>
          </DialogDescription>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex mt-5 flex-col gap-3 text-center"
          >
            <Box className="w-full justify-center gap-4">
              {feedbackOptions.map((option) => {
                const isSelected = selectedRating === option.value;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="ghost"
                    className={cn("h-fit p-2 transition-colors", {
                      "bg-green-300": isSelected && option.value === "HIGH",
                      "bg-yellow-300": isSelected && option.value === "MEDIUM",
                      "bg-red-300": isSelected && option.value === "LOW",
                    })}
                    onClick={() =>
                      setValue("rating", option.value, { shouldValidate: true })
                    }
                  >
                    <option.icon color={option.color} className="size-12" />
                  </Button>
                );
              })}
            </Box>
            <ErrorMessage show={!!errors.rating} className="mx-auto">
              {errors.rating?.message}
            </ErrorMessage>
            <Textarea
              {...register("text")}
              className="resize-none min-h-40"
              placeholder="Na sua opinião, o que poderia melhorar?"
            />
            <ButtonWithSpinner
              variant={"default"}
              type="submit"
              className="mt-5 mx-7"
              loading={mutation.isPending}
            >
              Enviar
            </ButtonWithSpinner>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
