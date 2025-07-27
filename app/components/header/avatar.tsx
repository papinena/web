import { AvatarFallback, AvatarImage, Avatar as AvatarUI } from "../ui/avatar";
import { Box } from "../ui/box";
import { Text } from "../ui/text";

interface AvatarProps {
  name?: string;
  email?: string;
  size?: number; // px
  className?: string;
}

function getInitial(name?: string, email?: string) {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return "?";
}

export function Avatar({ name, email, size = 40, className = "" }: AvatarProps) {
  const initial = getInitial(name, email);
  return (
    <AvatarUI className={className} style={{ width: size, height: size }} aria-label={name || email || "Avatar"}>
  <AvatarImage src="" />
  <AvatarFallback>U</AvatarFallback>
</AvatarUI>
  );
} 