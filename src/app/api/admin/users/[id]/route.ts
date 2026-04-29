import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { role } = await request.json();

    if (!["USER", "CREATOR", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
