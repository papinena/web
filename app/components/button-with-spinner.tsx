import React from "react";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full h-5 w-5 border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function ButtonWithSpinner({
  className,
  size,
  loading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  return (
    <Button
      className={cn(
        "mx-20 bg-green-primary hover:bg-green-primary/90",
        className
      )}
      size={size ?? "lg"}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner /> : children || "Enviar"}
    </Button>
  );
}
