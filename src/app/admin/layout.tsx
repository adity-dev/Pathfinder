import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") redirect("/");

  return (
    <div className="flex bg-[#f7fafd] min-h-screen">
      <Sidebar
        variant="admin"
        userName={payload.name}
        userRole="Administrator"
      />
      <div className="flex-1 ml-0 md:ml-64 p-6 md:p-12 min-h-screen">
        {children}
      </div>
    </div>
  );
}
