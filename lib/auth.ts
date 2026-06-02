import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || "litflo-admin";
const COOKIE_NAME    = "blog_admin_session";
const COOKIE_VALUE   = "authenticated";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (session?.value !== COOKIE_VALUE) redirect("/admin/login");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export { COOKIE_NAME, COOKIE_VALUE };
