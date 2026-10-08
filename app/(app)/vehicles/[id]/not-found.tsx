import Link from "next/link";
import { Car } from "lucide-react";
import Button from "@/components/ui/Button";

export default function VehicleNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted">
        <Car size={22} className="text-text-secondary" />
      </div>
      <div>
        <p className="text-sm font-medium">Vehicle not found</p>
        <p className="mt-1 text-xs text-text-secondary">
          It may have been deleted, or it isn&apos;t in your garage.
        </p>
      </div>
      <Link href="/vehicles">
        <Button variant="secondary">Back to garage</Button>
      </Link>
    </div>
  );
}
