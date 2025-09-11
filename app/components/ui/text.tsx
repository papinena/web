import { cn } from "~/lib/utils";

const variants = {
  body: "font-body text-base text-primary",
  default: "font-body text-base text-primary",
  title: "font-title text-title text-primary font-semibold",
  subtitle: "font-title text-xl font-semibold text-primary",
  legend: "font-body text-sm text-primary",
};

const colors = {
  admin: "text-green-primary",
  user: "text-blue-primary",
  default: "",
};

export type TextProps = React.ComponentProps<"p"> & {
  variant?: keyof typeof variants;
  color?: keyof typeof colors;
};

export function Text({
  children,
  className,
  variant = "default",
  color = "default",
  ...props
}: TextProps) {
  return (
    <p
      className={cn("", variants[variant], colors[color], className)}
      {...props}
    >
      {children}
    </p>
  );
}
