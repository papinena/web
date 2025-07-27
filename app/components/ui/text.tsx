import { cn } from "~/lib/utils";

const variants = {
  body: "font-body text-primary",
  default: "font-body text-primary",
  title: "font-title text-2xl text-primary font-semibold",
  subtitle: "font-title text-xl font-semibold text-primary",
};

export function Text({
  children,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"p"> & { variant?: keyof typeof variants }) {
  return (
    <p className={cn("", variants[variant], className)} {...props}>
      {children}
    </p>
  );
}
