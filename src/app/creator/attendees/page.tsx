import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export default async function CreatorAttendeesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value!;
  const payload = await verifyToken(token);

  let attendees: {
    id: number;
    status: string;
    createdAt: Date;
    user: { id: number; name: string; email: string };
    event: { id: number; title: string };
  }[] = [];

  try {
    attendees = await prisma.attendee.findMany({
      where: { event: { creatorId: payload!.userId } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    /* no data */
  }

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#181c1e]">My Attendees</h1>
          <p className="text-[#434656] mt-1">
            People registered for your events.
          </p>
        </div>
        <Link
          href="/creator"
          className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          Dashboard
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {attendees.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-3">
              group_off
            </span>
            <p className="font-medium">No attendees yet</p>
            <p className="text-sm mt-1">
              Create events to start getting registrations
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Attendee
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Event
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendees.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {att.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#181c1e]">
                          {att.user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {att.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#434656]">
                    <Link
                      href={`/events/${att.event.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {att.event.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        att.status === "REGISTERED"
                          ? "bg-green-50 text-green-700"
                          : att.status === "ATTENDED"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(att.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
