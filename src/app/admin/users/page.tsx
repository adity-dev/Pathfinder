"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count?: { events: number; attending: number };
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: number, role: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) fetchUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700",
    CREATOR: "bg-blue-50 text-blue-700",
    USER: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#181c1e]">User Management</h1>
          <p className="text-[#434656] mt-1">
            View and manage all platform users.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          Back to Dashboard
        </Link>
      </header>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
          search
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
          placeholder="Search by name or email..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined text-blue-600 text-[40px] animate-spin">
              progress_activity
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-3">
              group_off
            </span>
            <p>No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Joined
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#181c1e]">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none ${roleColors[user.role]}`}
                    >
                      <option value="USER">USER</option>
                      <option value="CREATOR">CREATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-slate-400">
                      ID #{user.id}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
