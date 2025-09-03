import { useEffect } from "react";
import { useToastStore, type ToastMessage } from "~/stores/toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastHeader,
  ToastTitle,
  ToastProvider,
} from "~/components/ui/toast";

export function ToastManager() {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {toasts.map((toast) => (
        <ToastProvider
          key={toast.id}
          onClose={() => removeToast(toast.id)}
          variant={toast.variant ?? "default"}
        >
          <ToastComponent toast={toast} />
        </ToastProvider>
      ))}
    </>
  );
}

function ToastComponent({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  return (
    <Toast variant={toast.variant} position={toast.position}>
      <ToastHeader>
        <ToastTitle>{toast.title}</ToastTitle>
        <ToastClose />
      </ToastHeader>
      <ToastDescription>{toast.description}</ToastDescription>
    </Toast>
  );
}
