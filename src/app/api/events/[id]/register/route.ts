import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const eventId = parseInt(id);

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    // Check if already registered
    const existing = await prisma.attendee.findUnique({
      where: { eventId_userId: { eventId, userId: payload.userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 409 },
      );
    }

    const attendee = await prisma.attendee.create({
      data: { eventId, userId: payload.userId, status: "REGISTERED" },
    });
    return NextResponse.json(attendee, { status: 201 });
  } catch (error) {
    console.error("Register event error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const eventId = parseInt(id);

    await prisma.attendee.delete({
      where: { eventId_userId: { eventId, userId: payload.userId } },
    });
    return NextResponse.json({ message: "Unregistered" });
  } catch {
    return NextResponse.json(
      { error: "Failed to unregister" },
      { status: 500 },
    );
  }
}
