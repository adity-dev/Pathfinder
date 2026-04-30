"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/explore?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/trending", label: "Trending" },
    { href: "/categories", label: "Categories" },
    {
      href:
        user && ["CREATOR", "ADMIN"].includes(user.role)
          ? "/creator/panel"
          : "/login",
      label: "Create",
    },
  ];

  // Don't show navbar on login/register pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="bg-transparent backdrop-blur-md fixed top-0 w-full z-50 antialiased text-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-8 flex-1">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-2 group"
          >
            <span
              className="material-symbols-outlined text-[28px] text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              explore
            </span>
            Pathfinder
          </Link>
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative items-center max-w-xs w-full"
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-blue-600 outline-none text-sm w-full transition-all"
              placeholder="Search events..."
              type="text"
            />
          </form>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`font-medium transition-colors duration-200 hover:text-blue-500 ${
                pathname === href ||
                (href !== "/" && pathname.startsWith(href.split("?")[0]))
                  ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 pb-1"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions desktop & mobile toggle */}
        <div className="flex items-center gap-4 ml-6">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      admin_panel_settings
                    </span>
                  </Link>
                )}
                {["CREATOR", "ADMIN"].includes(user.role) && (
                  <Link
                    href="/creator"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      dashboard
                    </span>
                  </Link>
                )}
                <button className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    notifications
                  </span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-full transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-12 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 min-w-[200px] py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold tracking-wider rounded-full">
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 font-medium"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    notifications
                  </span>
                </button>
                <Link
                  href="/login"
                  className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm px-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md dark:bg-slate-950/95 border-t border-slate-100 dark:border-slate-800 py-4 px-6 absolute top-full left-0 w-full shadow-lg z-40 flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileMenuOpen(false);
            }}
            className="relative flex items-center w-full mb-2"
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600 outline-none w-full text-sm font-medium"
              placeholder="Search events..."
              type="text"
            />
          </form>

          <div className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(href.split("?")[0]))
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      admin_panel_settings
                    </span>
                    Admin Panel
                  </Link>
                )}
                {["CREATOR", "ADMIN"].includes(user.role) && (
                  <Link
                    href="/creator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      dashboard
                    </span>
                    Creator Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium mt-1 text-left w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    logout
                  </span>
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-blue-600 text-white font-bold shadow-[0_4px_14px_0_rgb(37,99,235,0.39)]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
