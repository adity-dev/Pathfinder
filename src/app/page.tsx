import Link from "next/link";
import EventCard from "@/components/EventCard";

interface Event {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  location: string;
  category: string;
  imageUrl?: string | null;
  price: number;
  creatorId: number;
  creator?: { name: string };
  _count?: { attendees: number };
}

async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/events?limit=8`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvLgHo3bcX93zk6LkNQ2N_ffLiVgYzseVzGqZDZu7MCmlNKYrCejH8CHa6-vhoagv7NmMq5WwzCYoXY1DcDwiqcKrgMCxa4gnYHm5LJbHbiPf06kEWIOW47wFEHvXHOqbd9bcGK4782eYFKcdEpz0tHZ8Kewmn9hEtoBZ9t7QSZYPlDUk7mWIPy4n9t3oat6SaGo55ytrrgLRahkH57TOnn5MMyRJ4J4odfZY4w2HdpBCslo_5AKYrj30CCTDNQio3UiINa1YKTfz2";

const CATEGORIES = ["All", "Music", "Tech", "Education", "Sports", "General"];

export default async function LandingPage() {
  const events = await getFeaturedEvents();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-[#f7fafd] z-10" />
          <img
            src={HERO_BG}
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#181c1e] mb-6 max-w-4xl leading-tight">
            Discover What Matters, Near You
          </h1>
          <p className="text-lg text-[#434656] mb-10 max-w-2xl leading-relaxed">
            Connect with your community, explore trending events, and find
            exactly what you&apos;re looking for, right when you want it.
          </p>

          {/* Hero Search */}
          <div className="w-full max-w-2xl bg-white rounded-full shadow-[0_12px_32px_rgba(0,64,224,0.12)] p-2 flex items-center border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <div className="flex-1 flex items-center px-4 border-r border-slate-200">
              <span className="material-symbols-outlined text-[#747688] mr-3 text-[20px]">
                search
              </span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#181c1e] font-normal placeholder-slate-400"
                placeholder="What are you looking for?"
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4">
              <span className="material-symbols-outlined text-[#747688] mr-3 text-[20px]">
                location_on
              </span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#181c1e] placeholder-slate-400"
                placeholder="Location"
                type="text"
              />
            </div>
            <Link
              href="/explore"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors ml-2 whitespace-nowrap"
            >
              Search
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === "All" ? "/explore" : `/explore?category=${cat}`}
                className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-6xl mx-auto w-full px-6 lg:px-12 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#181c1e]">
              Upcoming Events
            </h2>
            <p className="text-[#434656] mt-1">
              Discover what&apos;s happening in your area
            </p>
          </div>
          <Link
            href="/explore"
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            View all{" "}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <span className="material-symbols-outlined text-[64px] text-slate-300 block mb-4">
              event
            </span>
            <p className="text-lg font-medium">No events yet</p>
            <p className="text-sm mt-1">Be the first to create one!</p>
            <Link
              href="/login"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to host your own event?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of creators sharing what they love with their
            community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
            >
              Start for Free
            </Link>
            <Link
              href="/explore"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
