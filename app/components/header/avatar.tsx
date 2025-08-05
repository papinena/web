import { useAuth } from "~/hooks/useAuth";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "../ui/avatar";
import { useImageReadToken } from "~/hooks/useImageReadToken";

interface AvatarProps {
  size?: number; // px
  className?: string;
}

export function Avatar({ size = 40, className = "" }: AvatarProps) {
  const { authData } = useAuth();
  const { containerUri, sasToken } = useImageReadToken();

  const data =
    authData?.userType === "user" ? authData.user : authData?.employee;
  const src = `${containerUri}/${data?.avatar}?${sasToken}`;

  return (
    <AvatarUI
      className={className}
      style={{ width: size, height: size }}
      aria-label={data.name || data.email || "Avatar"}
    >
      <AvatarImage src={src} />
      <AvatarFallback>{data.email[0]}</AvatarFallback>
    </AvatarUI>
  );
}
