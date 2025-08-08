import { Box } from "../ui/box";

interface HamburguerMenuIconProps {
  className?: string;
  ariaLabel?: string;
}

export function HamburguerMenuIcon({
  className = "",
  ariaLabel = "Open menu",
}: HamburguerMenuIconProps) {
  return (
    <Box
      className={`flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-gray-200 transition ${className}`}
      aria-label={ariaLabel}
    >
      <Box className="w-5 h-0.5 bg-[#AEB3B8] mb-1 rounded" />
      <Box className="w-5 h-0.5 bg-[#AEB3B8] mb-1 rounded" />
      <Box className="w-5 h-0.5 bg-[#AEB3B8] rounded" />
    </Box>
  );
}
