import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  location: string;
  category: string;
  imageUrl?: string | null;
  price: number;
  creator?: { name: string };
  _count?: { attendees: number };
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

export default function EventCard({
  event,
  size = "normal",
}: {
  event: Event;
  size?: "normal" | "wide";
}) {
  const imgSrc =
    event.imageUrl || categoryImages[event.category] || categoryImages.General;
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (size === "wide") {
    return (
      <Link href={`/events/${event.id}`}>
        <article className="bg-white rounded-[1rem] overflow-hidden shadow-[0_4px_24px_rgba(0,64,224,0.06)] hover:shadow-[0_12px_32px_rgba(0,64,224,0.12)] transition-all duration-300 group cursor-pointer flex h-44">
          <div className="w-1/3 relative overflow-hidden flex-shrink-0">
            <img
              src={imgSrc}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="w-2/3 p-5 flex flex-col justify-center gap-2">
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-wide">
              {event.category}
            </span>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-snug">
              {event.title}
            </h3>
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              {formattedDate}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`}>
      <article className="bg-white rounded-[1rem] overflow-hidden shadow-[0_4px_24px_rgba(0,64,224,0.06)] hover:shadow-[0_12px_32px_rgba(0,64,224,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col group cursor-pointer h-full">
        <div className="h-48 relative overflow-hidden flex-shrink-0">
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-slate-900 text-xs font-semibold shadow-sm">
            {event.price === 0 ? "Free" : `$${event.price}`}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="text-blue-600 text-xs font-semibold uppercase tracking-wide">
            {event.category}
          </div>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-snug">
            {event.title}
          </h3>
          <div className="mt-auto flex flex-col gap-2 text-slate-500 text-xs pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">
                calendar_today
              </span>
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">
                location_on
              </span>
              {event.location}
            </div>
            {event._count && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">
                  group
                </span>
                {event._count.attendees} attending
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
