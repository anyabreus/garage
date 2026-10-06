"use client";

import Image from "next/image";
import { signIn } from "@/actions/auth";
import Button from "../ui/Button";

export default function SignInButton() {
  return (
    <Button
      variant="secondary"
      className="w-full gap-2.5"
      onClick={() => signIn("google", { redirectTo: "/vehicles" })}
    >
      <Image src="/google.svg" alt="" width={18} height={18} />
      Continue with Google
    </Button>
  );
}
