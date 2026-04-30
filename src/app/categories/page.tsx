import Link from "next/link";

const CATEGORIES = [
  {
    name: "Music & Concerts",
    icon: "music_note",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Tech Events",
    icon: "computer",
    color: "bg-indigo-100 text-indigo-600",
  },
  { name: "Education", icon: "school", color: "bg-green-100 text-green-600" },
  {
    name: "Sports",
    icon: "sports_basketball",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Arts & Culture",
    icon: "palette",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Food & Drinks",
    icon: "restaurant",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Business",
    icon: "business_center",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Health & Wellness",
    icon: "self_improvement",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function CategoriesPage() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full pt-32 px-6 lg:px-12 py-12 flex flex-col gap-12 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Explore Categories
        </h1>
        <p className="text-lg text-slate-600">
          Discover events that match your passion. From technology and business
          to arts and sports, find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={`/explore?category=${encodeURIComponent(category.name)}`}
            className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300 hover:-translate-y-1 overflow-hidden block"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${category.color}`}
            >
              <span className="material-symbols-outlined text-[28px]">
                {category.icon}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              Browse events{" "}
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_right_alt
              </span>
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
