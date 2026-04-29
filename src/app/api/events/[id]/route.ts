import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        attendees: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { attendees: true } },
      },
    });

    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("Event GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
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
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });
    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (event.creatorId !== payload.userId && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date, location, category, imageUrl, price } =
      body;

    const updated = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(category && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(price !== undefined && { price: parseFloat(price) }),
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Event PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
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
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });
    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    if (event.creatorId !== payload.userId && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.event.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Event DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
}
