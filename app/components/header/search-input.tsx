import type { FormEvent, InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = "", ...props }, ref) => {
    const navigate = useNavigate();

    function onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const search = form.get("search");
      navigate(`/search?term=${search}`);
    }

    return (
      <Box className={`relative flex items-center ${className}`}>
        <form onSubmit={onSubmit}>
          <input
            ref={ref}
            type="search"
            name="search"
            className="pl-3 pr-8 py-2 rounded-lg bg-[#EFEFF0] focus:border-blue-500 focus:outline-none text-gray-900 w-full shadow-sm"
            aria-label={props.placeholder || "Buscar"}
            {...props}
          />
          <Button
            type="submit"
            variant={"link"}
            className="absolute cursor-pointer !pr-0 right-3 top-1/2 -translate-y-1/2"
          >
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
          </Button>
        </form>
      </Box>
    );
  }
);

SearchInput.displayName = "SearchInput";
