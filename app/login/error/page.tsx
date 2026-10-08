import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There's a problem with the sign-in setup. Try again shortly.",
  AccessDenied: "You don't have access to sign in to this app.",
  Verification: "That sign-in link has expired or was already used.",
};

export default async function LoginErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    (error && ERROR_MESSAGES[error]) || "Something went wrong signing you in.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-10">
      <div className="flex w-full max-w-85 flex-col items-center gap-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10">
          <TriangleAlert size={22} className="text-danger" />
        </div>
        <div>
          <p className="text-sm font-medium">Sign-in failed</p>
          <p className="mt-1 text-xs text-text-secondary">{message}</p>
        </div>
        <Link href="/login">
          <Button variant="secondary">Try again</Button>
        </Link>
      </div>
    </div>
  );
}
