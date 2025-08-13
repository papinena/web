import * as React from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

const ToastContext = React.createContext<{
  onClose: () => void;
} | null>(null);

const ToastProvider = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <ToastContext.Provider value={{ onClose }}>{children}</ToastContext.Provider>
);

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-5 right-5 z-50 w-full max-w-sm p-4 rounded-lg shadow-lg bg-white border border-gray-200",
      "animate-in slide-in-from-top-5",
      className
    )}
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
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 mt-1", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { onClose } = useToast();
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400",
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
