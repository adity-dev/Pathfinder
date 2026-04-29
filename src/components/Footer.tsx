import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 mt-auto bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-2xl mx-auto gap-8">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
        >
          Pathfinder
        </Link>
        <div className="text-sm text-slate-500 font-normal opacity-80 hover:opacity-100">
          © 2024 Pathfinder. Discover your next story.
        </div>
        <nav className="flex gap-6">
          <a
            href="#"
            className="text-sm text-slate-500 font-normal hover:text-blue-600 underline underline-offset-4 transition-all"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-slate-500 font-normal hover:text-blue-600 underline underline-offset-4 transition-all"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-slate-500 font-normal hover:text-blue-600 underline underline-offset-4 transition-all"
          >
            Help Center
          </a>
          <a
            href="#"
            className="text-sm text-slate-500 font-normal hover:text-blue-600 underline underline-offset-4 transition-all"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </footer>
  );
}
