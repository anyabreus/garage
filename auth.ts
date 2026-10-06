import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db";
import {
  usersTable,
  sessionsTable,
  verificationTokensTable,
  accountsTable,
} from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
  }),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
});
