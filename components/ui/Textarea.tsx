import { cn } from "@/lib/utils";
import { InputProps, inputVariants } from "./Input";

export default function Textarea({
  className,
  state,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  Pick<InputProps, "state">) {
  return (
    <textarea
      className={cn(inputVariants({ state }), "min-h-24", className)}
      {...props}
    />
  );
}
