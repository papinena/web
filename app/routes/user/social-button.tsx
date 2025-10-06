import { Button, type ButtonProps } from "~/components/ui/button";
import { GoogleIcon } from "~/components/google-icon";

type SocialButtonProps = ButtonProps & {
  provider: "google" | "apple";
};

export function SocialButton({ provider, ...props }: SocialButtonProps) {
  const icons = {
    google: <GoogleIcon />,
    apple: <img src="/apple-icon.svg" alt="Apple" className="w-6 h-6" />,
  };

  const labels = {
    google: "Entrar com Google",
    apple: "Entrar com Apple",
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-2"
      {...props}
    >
      {icons[provider]}
      {labels[provider]}
    </Button>
  );
}
