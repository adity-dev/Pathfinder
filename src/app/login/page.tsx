import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      if (payload.role === "ADMIN") redirect("/admin");
      if (payload.role === "CREATOR") redirect("/creator");
      redirect("/");
    }
  }
  return <LoginForm />;
}
