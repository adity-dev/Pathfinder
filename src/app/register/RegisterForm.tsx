"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        if (data.role === "ADMIN") router.push("/admin");
        else if (data.role === "CREATOR") router.push("/creator");
        else router.push("/");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafd] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter text-blue-600 hover:text-blue-500 transition-colors"
          >
            Pathfinder
          </Link>
          <p className="text-slate-500 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,64,224,0.12)] p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["USER", "CREATOR", "ADMIN"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                      form.role === role
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {role === "USER"
                      ? "👤 Attendee"
                      : role === "CREATOR"
                        ? "🎙️ Creator"
                        : "🛡️ Admin"}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  error
                </span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>{" "}
                  Creating account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    person_add
                  </span>{" "}
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                arrow_back
              </span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
