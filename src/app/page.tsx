import Link from "next/link";
import EventCard from "@/components/EventCard";
import prisma from "@/lib/prisma";

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
  } catch {
    return [];
  }
}

const HERO_BG =
  "https://content.jdmagicbox.com/comp/ernakulam/m4/0484px484.x484.140206113128.a9m4/catalogue/we-create-events-panampilly-nagar-ernakulam-event-management-companies-nsobpzm660.jpg";

const POPULAR_CATEGORIES = [
  {
    name: "Music & Concerts",
    icon: "music_note",
    color: "bg-gray-100 text-black",
  },
  { name: "Tech Events", icon: "computer", color: "bg-gray-100 text-black" },
  { name: "Education", icon: "school", color: "bg-gray-100 text-black" },
  {
    name: "Sports",
    icon: "sports_basketball",
    color: "bg-gray-100 text-black",
  },
  {
    name: "Arts & Culture",
    icon: "palette",
    color: "bg-gray-100 text-black",
  },
  {
    name: "Food & Drinks",
    icon: "restaurant",
    color: "bg-gray-100 text-black",
  },
];

export default async function LandingPage() {
  const events = await getFeaturedEvents();

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative  pt-32 pb-32 px-6 lg:px-12 overflow-hidden flex flex-col justify-center min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white z-10 backdrop-blur-[2px]" />
          <img
            src={HERO_BG}
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 backdrop-blur-md border border-blue-200/50 text-blue-700 font-semibold text-sm mb-8 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            Discover the best events happening right now
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 max-w-4xl leading-[1.1] drop-shadow-sm">
            Discover What{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Matters
            </span>
            , Near You
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
            Connect with your community, explore trending events, and find
            exactly what you&apos;re looking for—right when you want it.
          </p>

          {/* Hero Search */}
          <form
            action="/explore"
            method="GET"
            className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-full shadow-[0_20px_48px_rgba(0,64,224,0.15)] p-2.5 flex flex-col sm:flex-row items-center border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all gap-2 sm:gap-0"
          >
            <div className="flex-1 flex items-center px-4 w-full border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-[24px]">
                search
              </span>
              <input
                name="search"
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-800 font-medium placeholder-slate-400 text-lg"
                placeholder="Find events..."
                type="text"
              />
            </div>
            <div className="flex-1 flex items-center px-4 w-full pt-2 sm:pt-0">
              <span className="material-symbols-outlined text-slate-400 mr-3 text-[24px]">
                location_on
              </span>
              <input
                name="location"
                className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-800 font-medium placeholder-slate-400 text-lg"
                placeholder="Any location"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ml-0 sm:ml-2 w-full sm:w-auto text-center"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-white py-24 px-6 lg:px-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Pathfinder Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your journey to amazing local experiences in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border border-blue-100 shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <span
                  className="material-symbols-outlined text-[40px] text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  explore
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                1. Discover Events
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Browse through thousands of events happening near you. Filter by
                category, date, or price.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border border-blue-100 shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <span
                  className="material-symbols-outlined text-[40px] text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_activity
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                2. Book Your Spot
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Secure your tickets instantly. Register for free events or
                purchase premium passes securely.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full border border-blue-100 shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <span
                  className="material-symbols-outlined text-[40px] text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  celebration
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                3. Attend & Enjoy
              </h3>
              <p className="text-slate-600 leading-relaxed max-w-sm">
                Show up, scan your QR code ticket, and have a great time
                connecting with your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="bg-slate-50 py-24 px-6 lg:px-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Find the events that match your interests immediately.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group"
            >
              Explore all categories
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {POPULAR_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={`/explore?category=${encodeURIComponent(category.name.split(" ")[0])}`}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 border border-slate-100 group flex flex-col items-center justify-center aspect-square"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {category.icon}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="bg-white max-w-6xl mx-auto w-full px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-bold tracking-wider uppercase text-slate-500">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Upcoming Events
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Discover what&apos;s happening in your area
            </p>
          </div>
          <Link
            href="/explore"
            className="group px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors flex items-center gap-2"
          >
            View all events
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-6">
              <span className="material-symbols-outlined text-[48px] text-slate-300">
                event_busy
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No events found
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              There are currently no featured events. Be the first to create an
              amazing experience for your community!
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* NEW SECTION: Why Choose Pathfinder (Features) */}
      <section className="bg-slate-50 py-24 px-6 lg:px-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Pathfinder
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the best tools to discover, manage, and enjoy community
              events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  verified
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Verified Organizers
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Every creator goes through our verification process to ensure
                high-quality and safe events.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  security
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Secure Ticketing
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our advanced QR code system ensures your tickets are fraud-proof
                and easy to access.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  insights
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Real-time Insights
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Creators get powerful analytics to track ticket sales,
                attendance, and audience demographics.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[28px]">
                  support_agent
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                24/7 Support
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our dedicated team is always ready to help you with booking or
                organizing your events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Testimonials */}
      <section className="bg-white py-24 px-6 lg:px-12 border-b border-t border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Loved by attendees.
                <br />
                Trusted by creators.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Join over 50,000 active members who are using Pathfinder to
                connect with their local community and create unforgettable
                memories.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm z-30">
                    AJ
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm z-20">
                    MS
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm z-10">
                    TK
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm z-0">
                    +5k
                  </div>
                </div>
                <div>
                  <div className="flex text-amber-400 text-[20px]">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mt-1">
                    4.9/5 Average Rating
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 text-blue-50 opacity-80 z-0 hidden sm:block">
                <span
                  className="material-symbols-outlined text-[160px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_quote
                </span>
              </div>
              <div className="relative bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl shadow-blue-900/5 z-10">
                <p className="text-lg text-slate-800 font-medium italic leading-relaxed mb-8 relative">
                  &quot;Pathfinder completely changed how I organize my weekly
                  meetups. Managing RSVPs used to be a nightmare, but now
                  everything is automated. Attendees love how easy it is to find
                  the venue!&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    ED
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Elena Davies</h4>
                    <p className="text-sm text-slate-500">Community Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 z-0 text-white/5">
          <svg
            className="absolute top-0 right-0 h-full w-auto transform translate-x-1/3"
            viewBox="0 0 404 384"
            fill="currentColor"
          >
            <defs>
              <pattern
                id="pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#pattern)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center bg-white/10 backdrop-blur-md rounded-[3rem] p-12 md:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 text-white overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-500/40 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-sm">
              Ready to host your own event?
            </h2>
            <p className="text-blue-50 mb-10 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Join thousands of creators sharing what they love. Use our
              powerful tools to manage ticketing, attendees, and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-white text-blue-600 px-10 py-4 rounded-full font-black text-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Start for Free
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
