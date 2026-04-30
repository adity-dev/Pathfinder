import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const limit = parseInt(searchParams.get("limit") || "20");

    const events = await prisma.event.findMany({
      where: {
        ...(category && category !== "All" ? { category } : {}),
        ...(location
          ? { location: { contains: location, mode: "insensitive" } }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { attendees: true } },
      },
      orderBy: { date: "asc" },
      take: limit,
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !["CREATOR", "ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, date, location, category, imageUrl, price } =
      body;

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Title, date, and location are required" },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        location,
        category: category || "General",
        imageUrl: imageUrl || null,
        price: parseFloat(price) || 0,
        creatorId: payload.userId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
