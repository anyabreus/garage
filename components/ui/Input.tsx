import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm font-sans text-foreground transition-colors focus:outline-none focus:ring-3 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      state: {
        default: "border-border focus:border-signal focus:ring-signal/15",
        error: "border-danger focus:border-danger focus:ring-danger/15",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export default function Input({ className, state, ...props }: InputProps) {
  return (
    <input className={cn(inputVariants({ state }), className)} {...props} />
  );
}
