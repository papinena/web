import { useAuth } from "~/hooks/useAuth";
import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "../ui/avatar";
import { useImageReadToken } from "~/hooks/useImageReadToken";

interface AvatarProps {
  size?: number; // px
  className?: string;
  onClick(): void;
}

export function Avatar({ onClick, size = 40, className = "" }: AvatarProps) {
  const { authData } = useAuth();
  const { buildUrl } = useImageReadToken();

  const data =
    authData?.userType === "user" ? authData.user : authData?.employee;

  const isExternalUrl = data.avatar?.startsWith("http");
  const avatarUrl = isExternalUrl ? data.avatar : buildUrl(data.avatar);

  return (
    <AvatarUI
      onClick={onClick}
      className={className}
      style={{ width: size, height: size }}
      aria-label={data.name || data.email || "Avatar"}
    >
      <AvatarImage className="object-cover" src={avatarUrl} />
      <AvatarFallback>{data.email[0]}</AvatarFallback>
    </AvatarUI>
  );
}
