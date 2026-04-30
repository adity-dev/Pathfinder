"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { Suspense } from "react";

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

const CATEGORIES = ["All", "Music", "Tech", "Education", "Sports", "General"];

const HERO_IMAGES: Record<string, string> = {
  Tech: "https://lh3.googleusercontent.com/aida-public/AB6AXuDex_-8kTmEx72ibS8255YTtuDUmK0AS_0sAgXy93mMDtMDxy75jWO0_kqylB7S17cVLA8fHlys6qKapUwb3FbSa5twewpu5JSnIiAc77XSldWf80EgWGcQzS6poXcMeSckxvM_OfdQOQD9zrEU1VaEiW0M2u4iwZLGJNU81brWfOuWd_LGHKu9gAM_F_2xipgRe1_LIpN_iX9UWqZSoy99HGOm4EyW6FwtTriPc_dwfrlgLV_TDsVYXhr3GhXyJ5SpwNVllIcY3xyH",
  Music:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBaPZSQZAieKkl75J39Rw4R5DfepIogTcHVqlO3b2wG5MY5SzWyH8bjJQbsz0_BZ75_LVpu3kJNGCG6gul2R9GLkI2j8KR3gVtMMJrWuBPDg1ixR-RfjhzKMqNUMKX5fJcwivPqXEM-AbV2epOHB02mcGlBKFhTCDWM7Yqe3GwAo4kiH70-9_WPsDvpVq_LQP4VqVfhBRD4RPldMLod_0KT6dYyPWaLBqGoXRmZ2SfVOHhLtUOvT_wJ4nDBi7dNLF_IGmLwgbccAhO-",
  General:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCvLgHo3bcX93zk6LkNQ2N_ffLiVgYzseVzGqZDZu7MCmlNKYrCejH8CHa6-vhoagv7NmMq5WwzCYoXY1DcDwiqcKrgMCxa4gnYHm5LJbHbiPf06kEWIOW47wFEHvXHOqbd9bcGK4782eYFKcdEpz0tHZ8Kewmn9hEtoBZ9t7QSZYPlDUk7mWIPy4n9t3oat6SaGo55ytrrgLRahkH57TOnn5MMyRJ4J4odfZY4w2HdpBCslo_5AKYrj30CCTDNQio3UiINa1YKTfz2",
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (category && category !== "All") params.set("category", category);
      const res = await fetch(`/api/events?${params.toString()}`);
      if (res.ok) setEvents(await res.json());
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [search, location, category]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(handler);
  }, [fetchEvents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/explore?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}&category=${category}`,
    );
    fetchEvents();
  };

  const featuredEvent = events[0];
  const sideEvents = events.slice(1, 3);
  const gridEvents = events.slice(3);

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full pt-32 px-6 lg:px-12 py-12 flex flex-col gap-12">
      {/* Hero & Filter Section */}
      <section className="flex flex-col gap-6">
        <h1 className="text-5xl font-black tracking-tight text-[#181c1e]">
          Discover your next experience
        </h1>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_rgba(0,64,224,0.06)] flex flex-col md:flex-row gap-4 w-full border border-slate-100">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 flex-1"
          >
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#747688] text-[20px]">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-[#181c1e] bg-white transition-all"
                placeholder="What are you looking for?"
                type="text"
              />
            </div>
            <div className="flex-1 relative hidden md:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#747688] text-[20px]">
                location_on
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-[#181c1e] bg-white transition-all"
                placeholder="Location"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-[#dde1ff] text-[#001356] hover:bg-blue-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-blue-600 text-[48px] animate-spin">
              progress_activity
            </span>
            <p className="text-slate-500 font-medium">Loading events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-[64px] text-slate-300 block mb-4">
            search_off
          </span>
          <p className="text-xl font-bold text-slate-700">No events found</p>
          <p className="text-slate-500 mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <>
          {/* Featured Bento Grid */}
          {featuredEvent && (
            <section className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-[#181c1e]">
                Recommended for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Large Feature Card — fully linked */}
                <Link
                  href={`/events/${featuredEvent.id}`}
                  className="md:col-span-8 block"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,64,224,0.06)] hover:shadow-[0_12px_32px_rgba(0,64,224,0.12)] transition-all duration-300 group cursor-pointer relative h-[400px]">
                    <img
                      src={
                        featuredEvent.imageUrl ||
                        HERO_IMAGES[featuredEvent.category] ||
                        HERO_IMAGES.General
                      }
                      alt={featuredEvent.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-3 w-full">
                      <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold w-max uppercase tracking-wider">
                        {featuredEvent.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-tight">
                        {featuredEvent.title}
                      </h3>
                      <div className="flex items-center gap-6 text-white/90 text-sm mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">
                            calendar_today
                          </span>
                          {new Date(featuredEvent.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">
                            location_on
                          </span>
                          {featuredEvent.location}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>

                {/* Stacked Side Cards */}
                <div className="md:col-span-4 flex flex-col gap-6 h-[400px]">
                  {sideEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} size="wide" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Grid */}
          {gridEvents.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-[#181c1e]">
                  Explore All Events
                </h2>
                <span className="text-slate-500 text-sm">
                  {events.length} events found
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gridEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined text-blue-600 text-[48px] animate-spin">
            progress_activity
          </span>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
