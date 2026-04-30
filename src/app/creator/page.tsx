import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

async function getCreatorData(userId: number) {
  try {
    const [events, totalAttendees] = await Promise.all([
      prisma.event.findMany({
        where: { creatorId: userId },
        include: { _count: { select: { attendees: true } } },
        orderBy: { date: "asc" },
      }),
      prisma.attendee.count({
        where: { event: { creatorId: userId } },
      }),
    ]);
    return { events, totalAttendees };
  } catch {
    return { events: [], totalAttendees: 0 };
  }
}

export default async function CreatorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value!;
  const payload = await verifyToken(token)!;
  const { events, totalAttendees } = await getCreatorData(payload!.userId);

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.date) < new Date());

  return (
    <div>
      <header className="mb-8 pt-16 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#181c1e]">My Dashboard</h1>
          <p className="text-[#434656] mt-1">
            Manage your events and track performance.
          </p>
        </div>
        <Link
          href="/creator/panel"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            add_circle
          </span>
          Create Event
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Events",
            value: events.length,
            icon: "event",
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Upcoming Events",
            value: upcomingEvents.length,
            icon: "upcoming",
            color: "text-orange-600 bg-orange-50",
          },
          {
            label: "Total Attendees",
            value: totalAttendees,
            icon: "group",
            color: "text-green-600 bg-green-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#434656] uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-[#181c1e]">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#181c1e]">My Events</h2>
          <div className="flex gap-2">
            <Link
              href="/creator/attendees"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              View Attendees{" "}
              <span className="material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-3">
              event
            </span>
            <p className="font-semibold text-slate-700">No events yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Create your first event to get started
            </p>
            <Link
              href="/creator/panel"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    event
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-[#181c1e] truncate">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-[#434656] flex items-center gap-2 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">
                      calendar_today
                    </span>
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    <span className="material-symbols-outlined text-[12px]">
                      location_on
                    </span>
                    {ev.location}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {ev._count.attendees} attending
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      new Date(ev.date) >= new Date()
                        ? "bg-green-50 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {new Date(ev.date) >= new Date() ? "Upcoming" : "Past"}
                  </span>
                  <Link
                    href={`/creator/panel?edit=${ev.id}`}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      edit
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
