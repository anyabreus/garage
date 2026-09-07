import { cn } from "@/lib/utils";
import { InputProps, inputVariants } from "./Input";

export default function Select({
  className,
  state,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & Pick<InputProps, "state">) {
  return (
    <select
      className={cn(inputVariants({ state }), "custom-select", className)}
      {...props}
    />
  );
}
