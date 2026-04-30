import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-600 antialiased pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 mb-4 group"
            >
              <span
                className="material-symbols-outlined text-[28px] text-blue-600 group-hover:rotate-12 transition-transform duration-300"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                explore
              </span>
              Pathfinder
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Your ultimate platform to discover, join, and organize local
              events. Connect with your community and experience the world
              around you.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-slate-500 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  public
                </span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-slate-500 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  share
                </span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-slate-500 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  forum
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-bold mb-5 uppercase tracking-wider text-xs">
              Discover
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/explore"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  All Events
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?category=Music"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?category=Tech"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Tech Conferences
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?category=Sports"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Sports & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators Column */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 font-bold mb-5 uppercase tracking-wider text-xs">
              Creators
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/register"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Host an Event
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Ticketing Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-blue-600 hover:translate-x-1 inline-block transition-all font-medium"
                >
                  Creator Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe Column */}
          <div className="lg:col-span-4">
            <h3 className="text-slate-900 font-bold mb-5 uppercase tracking-wider text-xs">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Subscribe to our newsletter to get weekly updates on the best
              upcoming events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full text-sm placeholder-slate-400 transition-colors shadow-sm"
                required
              />
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Pathfinder Inc. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
