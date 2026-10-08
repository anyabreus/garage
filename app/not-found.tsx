import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted">
        <Compass size={22} className="text-text-secondary" />
      </div>
      <div>
        <p className="text-sm font-medium">Page not found</p>
        <p className="mt-1 text-xs text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link href="/vehicles">
        <Button variant="secondary">Back to garage</Button>
      </Link>
    </div>
  );
}
