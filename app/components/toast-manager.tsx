import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useToastStore, type ToastMessage } from "~/stores/toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastHeader,
  ToastTitle,
  ToastProvider,
  type ToastPosition,
} from "~/components/ui/toast";
import { cn } from "~/lib/utils";

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-5 left-5",
  "top-center": "top-5 left-1/2 -translate-x-1/2",
  "top-right": "top-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-5 right-5",
};

export function ToastManager() {
  const { toasts } = useToastStore();

  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position ?? "bottom-center";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, ToastMessage[]>);

  return (
    <>
      {Object.entries(groupedToasts).map(([position, toasts]) => (
        <div
          key={position}
          className={cn(
            "fixed z-50 min-w-80 flex flex-col gap-2",
            positionClasses[position as ToastPosition]
          )}
        >
          {toasts.map((toast) => (
            <ToastComponent key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
    </>
  );
}

function ToastComponent({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  const handleToastClick = () => {
    if (toast.url) {
      navigate(toast.url);
      removeToast(toast.id);
    }
  };

  return (
    <div
      onClick={handleToastClick}
      style={{ cursor: toast.url ? "pointer" : "default" }}
    >
      <ToastProvider
        onClose={() => removeToast(toast.id)}
        variant={toast.variant ?? "default"}
      >
        <Toast variant={toast.variant}>
          <ToastHeader>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastClose />
          </ToastHeader>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      </ToastProvider>
    </div>
  );
}
