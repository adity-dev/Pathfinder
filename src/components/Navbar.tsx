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
    { href: "/explore?category=Music", label: "Trending" },
    { href: "/explore", label: "Categories" },
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
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 w-full z-50 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm antialiased text-slate-900 dark:text-slate-100">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Brand + Search */}
        <div className="flex items-center gap-8 flex-1">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
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

        {/* Actions */}
        <div className="flex items-center gap-3 ml-6">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    admin_panel_settings
                  </span>
                </Link>
              )}
              {["CREATOR", "ADMIN"].includes(user.role) && (
                <Link
                  href="/creator"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    dashboard
                  </span>
                </Link>
              )}
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  notifications
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    account_circle
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 min-w-[180px] py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">
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
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  notifications
                </span>
              </button>
              <Link
                href="/login"
                className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-500 transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
