import prisma from "@/lib/prisma";

export default async function AdminAnalytics() {
  let eventsByCategory: { category: string; _count: { _all: number } }[] = [];
  let recentUsers = 0;
  let totalEvents = 0;

  try {
    const [catGroup, usersThisWeek, eventsTotal] = await Promise.all([
      prisma.event.groupBy({ by: ["category"], _count: { _all: true } }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
        },
      }),
      prisma.event.count(),
    ]);
    eventsByCategory = catGroup;
    recentUsers = usersThisWeek;
    totalEvents = eventsTotal;
  } catch {
    /* DB may not be set up */
  }

  const maxCount = Math.max(...eventsByCategory.map((c) => c._count._all), 1);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#181c1e]">
          Platform Analytics
        </h1>
        <p className="text-[#434656] mt-1">Real-time metrics and insights.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="material-symbols-outlined text-blue-600 text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person_add
            </span>
            <h3 className="font-semibold text-slate-700">
              New Users This Week
            </h3>
          </div>
          <p className="text-4xl font-black text-[#181c1e]">{recentUsers}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="material-symbols-outlined text-orange-600 text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              event
            </span>
            <h3 className="font-semibold text-slate-700">Total Events</h3>
          </div>
          <p className="text-4xl font-black text-[#181c1e]">{totalEvents}</p>
        </div>
      </div>

      {/* Events by Category Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-[#181c1e] mb-6">
          Events by Category
        </h2>
        {eventsByCategory.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No events yet to analyze.
          </p>
        ) : (
          <div className="space-y-4">
            {eventsByCategory.map((cat) => (
              <div key={cat.category} className="flex items-center gap-4">
                <span className="w-24 text-sm font-semibold text-[#434656] text-right flex-shrink-0">
                  {cat.category}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${(cat._count._all / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-[#181c1e] w-8 text-right">
                  {cat._count._all}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
