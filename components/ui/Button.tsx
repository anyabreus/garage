import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-signal border border-signal text-background not-disabled:hover:opacity-90",
        secondary:
          "bg-surface border border-border not-disabled:hover:border-signal",
        ghost:
          "bg-transparent border border-transparent text-text-secondary not-disabled:hover:text-foreground",
        danger: "bg-transparent text-danger not-disabled:hover:bg-danger/8",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3.5 py-2 text-[13px]",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export default function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
