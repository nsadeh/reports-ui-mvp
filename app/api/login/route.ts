import { NextResponse } from "next/server";

const COOKIE_NAME = "ilab_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  const internal = process.env.SHARED_PASSWORD_INTERNAL ?? "";
  const customer = process.env.SHARED_PASSWORD_CUSTOMER ?? "";

  let role: "internal" | "customer" | null = null;
  if (internal && password === internal) role = "internal";
  else if (customer && password === customer) role = "customer";

  if (!role) {
    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true, redirectTo: "/" });
  res.cookies.set({
    name: COOKIE_NAME,
    value: role,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
