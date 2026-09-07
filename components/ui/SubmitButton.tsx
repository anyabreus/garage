import Button from "./Button";

export default function SubmitButton({
  isPending,
  label,
  pendingLabel = "Saving...",
}: {
  isPending: boolean;
  label: string;
  pendingLabel?: string;
}) {
  return (
    <Button disabled={isPending} className="mt-4">
      {isPending ? pendingLabel : label}
    </Button>
  );
}
