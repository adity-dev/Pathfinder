import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  try {
    const [userCount, eventCount, attendeeCount] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.attendee.count(),
    ]);
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { name: true } },
        _count: { select: { attendees: true } },
      },
    });
    return { userCount, eventCount, attendeeCount, recentEvents };
  } catch {
    return { userCount: 0, eventCount: 0, attendeeCount: 0, recentEvents: [] };
  }
}

export default async function AdminDashboard() {
  const { userCount, eventCount, attendeeCount, recentEvents } =
    await getStats();

  const kpis = [
    {
      label: "Total Active Users",
      value: userCount.toLocaleString(),
      icon: "group",
      trend: "+12.5%",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Events",
      value: eventCount.toLocaleString(),
      icon: "event",
      trend: "+8.2%",
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Total Registrations",
      value: attendeeCount.toLocaleString(),
      icon: "confirmation_number",
      trend: "+24.1%",
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#181c1e]">
            Platform Overview
          </h1>
          <p className="text-[#434656] mt-1">
            Monitor daily operations and platform health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#181c1e] hover:bg-slate-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <Link
            href="/admin/users"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              manage_accounts
            </span>
            Manage Users
          </Link>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.color}`}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {kpi.icon}
                </span>
              </div>
              <span className="text-green-600 font-semibold text-xs flex items-center">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>
                {kpi.trend}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#434656] uppercase tracking-wide mb-1">
                {kpi.label}
              </h3>
              <p className="text-3xl font-bold text-[#181c1e]">{kpi.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <section className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#181c1e]">
                Recent Events
              </h2>
              <p className="text-sm text-[#434656] mt-0.5">
                Latest events created on the platform
              </p>
            </div>
            <Link
              href="/explore"
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              View all{" "}
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No events yet</p>
            ) : (
              recentEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
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
                    <p className="text-xs text-[#434656]">
                      by {ev.creator.name} •{" "}
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {ev._count.attendees} attending
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-[#181c1e] mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                href: "/admin/users",
                icon: "group",
                label: "Manage Users",
                desc: "View and edit accounts",
                color: "text-blue-600 bg-blue-50",
              },
              {
                href: "/admin/analytics",
                icon: "analytics",
                label: "View Analytics",
                desc: "Platform metrics & trends",
                color: "text-purple-600 bg-purple-50",
              },
              {
                href: "/explore",
                icon: "explore",
                label: "Browse Events",
                desc: "Explore all platform events",
                color: "text-green-600 bg-green-50",
              },
              {
                href: "/creator/panel",
                icon: "add_circle",
                label: "Create Event",
                desc: "Post a new event",
                color: "text-orange-600 bg-orange-50",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {action.icon}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#181c1e] group-hover:text-blue-600 transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-xs text-[#434656]">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
