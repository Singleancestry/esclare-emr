import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utilities/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[#6F263D] text-white hover:bg-[#481827]",
    secondary: "border border-[#C6A467] bg-white text-[#481827] hover:bg-[#F8F4ED]",
    ghost: "bg-transparent text-[#481827] hover:bg-[#F8F4ED]",
  };

  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
