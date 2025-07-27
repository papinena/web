import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Box } from "../ui/box";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <Box className={`relative flex items-center ${className}`}>
        <input
          ref={ref}
          type="search"
          className="pl-3 pr-4 py-2 rounded-lg bg-[#EFEFF0] focus:border-blue-500 focus:outline-none text-gray-900 w-full shadow-sm"
          aria-label={props.placeholder || "Buscar"}
          {...props}
        />
        <Box className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {/* Simple magnifier icon (SVG) */}
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-400"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Box>
      </Box>
    );
  }
);

SearchInput.displayName = "SearchInput";
