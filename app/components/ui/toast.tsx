import * as React from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const toastVariants = cva(
  "w-full max-w-sm p-4 rounded-lg shadow-lg border",
  {
    variants: {
      variant: {
        default: "bg-blue-primary border-blue-primary text-white",
        destructive: "bg-red-500 text-white border-red-600",
        success: "bg-green-500 text-white border-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type ToastVariant = VariantProps<typeof toastVariants>["variant"];
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const ToastContext = React.createContext<{
  onClose: () => void;
  variant: ToastVariant;
} | null>(null);

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider = ({
  children,
  onClose,
  variant,
}: {
  children: React.ReactNode;
  onClose: () => void;
  variant: ToastVariant;
}) => (
  <ToastContext.Provider value={{ onClose, variant }}>
    {children}
  </ToastContext.Provider>
);

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = "Toast";

const ToastHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between", className)}
    {...props}
  />
));
ToastHeader.displayName = "ToastHeader";

const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-lg font-semibold text-white", className)}
      {...props}
    />
  );
});
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm mt-1 text-white/90", className)}
      {...props}
    />
  );
});
ToastDescription.displayName = "ToastDescription";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { onClose, variant } = useToast();
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "p-1 rounded-full bg-white focus:outline-none focus:ring-2",
        {
          "text-blue-primary hover:bg-blue-100 focus:ring-blue-400":
            variant === "default",
          "text-red-500 hover:bg-red-100 focus:ring-red-400":
            variant === "destructive",
          "text-green-500 hover:bg-green-100 focus:ring-green-400":
            variant === "success",
        },
        className
      )}
      onClick={onClose}
      {...props}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </button>
  );
});
ToastClose.displayName = "ToastClose";

export {
  Toast,
  ToastHeader,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastProvider,
};