import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-foreground"
    >
      <ArrowLeft size={14} />
      {label}
    </Link>
  );
}
