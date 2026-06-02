import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, COOKIE_NAME, COOKIE_VALUE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!await verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set(COOKIE_NAME, COOKIE_VALUE, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
  return resp;
}
