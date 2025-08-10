import type { ReactNode } from "react";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

// --- Sub-components ---

interface WidgetTitleProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

function WidgetTitle({ children, className, icon }: WidgetTitleProps) {
  return (
    <Box className="gap-1.5 items-center">
      {icon}
      <Text className={cn("text-lg", className)}>{children}</Text>
    </Box>
  );
}

// --- Main Component ---

interface WidgetProps {
  children: ReactNode;
  className?: string;
}

interface WidgetComposition {
  Title: typeof WidgetTitle;
}

export const Widget: React.FC<WidgetProps> & WidgetComposition = ({
  children,
  className,
}) => {
  return (
    <Box
      className={cn(
        "border-2 bg-white rounded-xl gap-2 px-2 pb-5 pt-2 min-h-28 flex-col",
        className
      )}
    >
      {children}
    </Box>
  );
};

Widget.Title = WidgetTitle;
