import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
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
  return <RegisterForm />;
}
