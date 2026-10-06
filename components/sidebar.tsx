"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Road, BellRing } from "lucide-react";
import SignOutButton from "./auth/SignOutButton";

const NAV_ITEMS = [
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/reminders", label: "Reminders", icon: BellRing },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-14 shrink-0 flex-col items-center gap-5 border-r border-border bg-surface-muted py-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-signal">
        <Road size={16} className="text-background" />
      </div>

      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={
              isActive
                ? "text-signal"
                : "text-text-secondary hover:text-foreground"
            }
          >
            <Icon size={18} />
          </Link>
        );
      })}

      <SignOutButton />
    </nav>
  );
}
