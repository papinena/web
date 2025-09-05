import { cn } from "~/lib/utils";

const variants = {
  body: "font-body text-primary",
  default: "font-body text-primary",
  title: "font-title text-2xl text-primary font-semibold",
  subtitle: "font-title text-xl font-semibold text-primary",
};

const colors = {
  admin: "text-green-primary",
  user: "text-blue-primary",
  default: "",
};

export function Text({
  children,
  className,
  variant = "default",
  color = "default",
  ...props
}: React.ComponentProps<"p"> & {
  variant?: keyof typeof variants;
  color?: keyof typeof colors;
}) {
  return (
    <p
      className={cn("", variants[variant], colors[color], className)}
      {...props}
    >
      {children}
    </p>
  );
}
