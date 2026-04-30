import Link from "next/link";
import EventCard from "@/components/EventCard";
import prisma from "@/lib/prisma";

async function getTrendingEvents() {
  try {
    const events = await prisma.event.findMany({
      take: 8,
      orderBy: { date: "asc" },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { attendees: true } },
      },
    });
    return events.map((e) => ({
      ...e,
      date: e.date.toISOString(),
      creator: e.creator || undefined,
      _count: e._count,
    })) as any;
  } catch (error) {
    return [];
  }
}

export default async function TrendingPage() {
  const events = await getTrendingEvents();

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full pt-32 px-6 lg:px-12 py-12 flex flex-col gap-12 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-red-500 animate-pulse text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm">
              Trending Now
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            The Hottest Events
            <br />
            This Week
          </h1>
        </div>
        <p className="text-lg text-slate-600 max-w-md">
          Don't miss out on what everyone is talking about. Secure your spot
          before they sell out!
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-[64px] text-slate-300 block mb-4">
            search_off
          </span>
          <p className="text-xl font-bold text-slate-700">
            No trending events found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((ev: any) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-sm"
        >
          Explore More
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </main>
  );
}
