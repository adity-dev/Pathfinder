"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  variant: "admin" | "creator";
  userName?: string;
  userRole?: string;
}

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/admin/users", label: "User Management", icon: "group" },
  { href: "/explore", label: "View Platform", icon: "open_in_new" },
];

const creatorLinks = [
  { href: "/creator", label: "Dashboard", icon: "dashboard" },
  { href: "/creator/panel", label: "Create Event", icon: "add_circle" },
  { href: "/creator/attendees", label: "Attendees", icon: "group" },
  { href: "/explore", label: "Explore Events", icon: "explore" },
];

export default function Sidebar({
  variant,
  userName = "User",
  userRole,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = variant === "admin" ? adminLinks : creatorLinks;
  const brandLabel = variant === "admin" ? "Admin Panel" : "Creator Hub";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const settingsLink = variant === "admin" ? "/admin" : "/creator";

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40">
      <div className="flex flex-col h-full p-4 space-y-2">
        {/* Brand */}
        <div className="mb-8 px-4 py-2">
          <Link
            href="/"
            className="text-xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
            Pathfinder
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">{brandLabel}</p>
        </div>

        {/* Nav Links */}
        <div className="space-y-1 flex-1">
          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide hover:translate-x-1 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Profile area */}
        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_circle
              </span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {userName}
              </span>
              <span className="text-xs text-slate-500">
                {userRole ||
                  (variant === "admin" ? "Administrator" : "Creator")}
              </span>
            </div>
          </div>
          <Link
            href={`${settingsLink}/panel`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              add_circle
            </span>
            {variant === "admin" ? "Platform Settings" : "Create Event"}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
