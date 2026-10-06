"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import Button from "../ui/Button";

export default function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ redirectTo: "/login" })}
      aria-label="Log out"
    >
      <LogOut size={18} />
    </Button>
  );
}
