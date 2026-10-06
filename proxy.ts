import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === "/login";

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/vehicles" : "/login", req.url),
    );
  }

  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL("/vehicles", req.url));
  }

  if (!isLoggedIn && !isOnLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/", "/login", "/vehicles/:path*", "/reminders/:path*"],
};
