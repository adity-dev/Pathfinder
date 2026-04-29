import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import RegisterButton from "@/app/events/[id]/RegisterButton";

interface PageParams {
  params: Promise<{ id: string }>;
}

async function getEvent(id: number) {
  try {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        attendees: {
          include: { user: { select: { id: true, name: true, email: true } } },
          take: 20,
        },
        _count: { select: { attendees: true } },
      },
    });
  } catch {
    return null;
  }
}

const categoryImages: Record<string, string> = {
  Music:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPZSQZAieKkl75J39Rw4R5DfepIogTcHVqlO3b2wG5MY5SzWyH8bjJQbsz0_BZ75_LVpu3kJNGCG6gul2R9GLkI2j8KR3gVtMMJrWuBPDg1ixR-RfjhzKMqNUMKX5fJcwivPqXEM-AbV2epOHB02mcGlBKFhTCDWM7Yqe3GwAo4kiH70-9_WPsDvpVq_LQP4VqVfhBRD4RPldMLod_0KT6dYyPWaLBqGoXRmZ2SfVOHhLtUOvT_wJ4nDBi7dNLF_IGmLwgbccAhO-",
  Tech: "https://lh3.googleusercontent.com/aida-public/AB6AXuDex_-8kTmEx72ibS8255YTtuDUmK0AS_0sAgXy93mMDtMDxy75jWO0_kqylB7S17cVLA8fHlys6qKapUwb3FbSa5twewpu5JSnIiAc77XSldWf80EgWGcQzS6poXcMeSckxvM_OfdQOQD9zrEU1VaEiW0M2u4iwZLGJNU81brWfOuWd_LGHKu9gAM_F_2xipgRe1_LIpN_iX9UWqZSoy99HGOm4EyW6FwtTriPc_dwfrlgLV_TDsVYXhr3GhXyJ5SpwNVllIcY3xyH",
  Education:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCN_qVZkMSLDfHQrAPZoKJ3dDfwUxlRgqMALx4B2R5HNtd3P0pGRke-VhuthUwI5SUdYXOtkFUU3ZJTHv9qrZNeeEV57UQ-6PDklniBLCwalNmSpfh69A0YCgIeYhikouBtcRSeG2xVcKFfKfoy0SBC462t6SsvxOg1AlgPNBBpkYLaRLadDwsK9Ls7tzwSFgqck3Uw47FMQwzNIzGlUXmNL7kfMUGQHCQ_Wrz5EoZ9VevLl8TkAsy31j5W3_xNBa7aFRe5YSie41BL",
  Sports:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAOCMW6br7yU3Dl47UbA57xAGbAhrLxgj-k97ZXmsKPpDq-d3vUY2Q0TUqo8_9_RCnVIFwDYnohJcwpOhQ3S6QXnkvo1pIpAyeliUvLCQ3-K81ZyqgEyryFnJSZNMkJ8E-SHFLfSTHo-gIfQ6Rx5tyHECzmOPG8vMEmBMF4m9QN2fbCOnv2wWIRrNPf85Ya_0Hv5udng7FLGATcRkCgckTd-NxZX5d40TkY8sO8fVqIpHlOExeXSz4sXxfi5ianpZvGNqqTpWXF8DWC",
  General:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCvLgHo3bcX93zk6LkNQ2N_ffLiVgYzseVzGqZDZu7MCmlNKYrCejH8CHa6-vhoagv7NmMq5WwzCYoXY1DcDwiqcKrgMCxa4gnYHm5LJbHbiPf06kEWIOW47wFEHvXHOqbd9bcGK4782eYFKcdEpz0tHZ8Kewmn9hEtoBZ9t7QSZYPlDUk7mWIPy4n9t3oat6SaGo55ytrrgLRahkH57TOnn5MMyRJ4J4odfZY4w2HdpBCslo_5AKYrj30CCTDNQio3UiINa1YKTfz2",
};

export default async function EventDetailPage({ params }: PageParams) {
  const { id } = await params;
  const event = await getEvent(parseInt(id));
  if (!event) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const currentUser = token ? await verifyToken(token) : null;

  const isOwner =
    currentUser?.userId === event.creatorId || currentUser?.role === "ADMIN";
  const imgSrc =
    event.imageUrl || categoryImages[event.category] || categoryImages.General;

  // Check if current user is already registered
  const isRegistered = currentUser
    ? event.attendees.some((a) => a.user.id === currentUser.userId)
    : false;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-700 mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">
          arrow_back
        </span>
        Back to Explore
      </Link>

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,64,224,0.12)] mb-8">
        <img
          src={imgSrc}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
        </div>
        {isOwner && (
          <div className="absolute top-6 right-6">
            <Link
              href={`/creator/panel?edit=${event.id}`}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              Edit
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-black text-[#181c1e] leading-tight mb-4">
            {event.title}
          </h1>

          {event.description && (
            <p className="text-[#434656] text-lg leading-relaxed mb-6">
              {event.description}
            </p>
          )}

          {/* Attendees */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#181c1e] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">
                group
              </span>
              Attendees ({event._count.attendees})
            </h2>
            {event.attendees.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No one has registered yet. Be the first!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                      {a.user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[#181c1e]">
                      {a.user.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5">
                calendar_today
              </span>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Date & Time
                </p>
                <p className="text-sm font-semibold text-[#181c1e]">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5">
                location_on
              </span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Location</p>
                <p className="text-sm font-semibold text-[#181c1e]">
                  {event.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5">
                confirmation_number
              </span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Price</p>
                <p className="text-sm font-semibold text-[#181c1e]">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px] mt-0.5">
                person
              </span>
              <div>
                <p className="text-xs text-slate-500 font-medium">Organizer</p>
                <p className="text-sm font-semibold text-[#181c1e]">
                  {event.creator.name}
                </p>
              </div>
            </div>
          </div>

          {/* Registration CTA */}
          {currentUser ? (
            <RegisterButton
              eventId={event.id}
              initialRegistered={isRegistered}
            />
          ) : (
            <Link
              href={`/login?redirect=/events/${event.id}`}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              Sign In to Register
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
