import { Car } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="flex w-full max-w-85 flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal">
            <Car size={22} className="text-background" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Garage</p>
            <p className="mt-1 text-xs text-text-secondary">
              Track your vehicles, one mile at a time.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <p className="text-center text-sm font-medium">Sign in to continue</p>

          <SignInButton />

          <p className="text-center text-[11px] text-text-secondary">
            By continuing you agree to keep track of your own maintenance
            schedule — no one else will do it for you.
          </p>
        </div>
      </div>
    </div>
  );
}
