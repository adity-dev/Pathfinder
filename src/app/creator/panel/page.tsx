"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = ["Music", "Tech", "Education", "Sports", "General"];

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  price: number;
}

function CreatorPanelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "General",
    imageUrl: "",
    price: "0",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadEventForEdit = useCallback(async (id: string) => {
    const res = await fetch(`/api/events/${id}`);
    if (res.ok) {
      const event: Event = await res.json();
      setIsEditing(true);
      setForm({
        title: event.title,
        description: event.description || "",
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        category: event.category,
        imageUrl: event.imageUrl || "",
        price: String(event.price),
      });
    }
  }, []);

  useEffect(() => {
    if (editId) loadEventForEdit(editId);
  }, [editId, loadEventForEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url = editId ? `/api/events/${editId}` : "/api/events";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save event");
      } else {
        setSuccess(
          editId
            ? "Event updated successfully!"
            : "Event created successfully!",
        );
        if (!editId) {
          setForm({
            title: "",
            description: "",
            date: "",
            location: "",
            category: "General",
            imageUrl: "",
            price: "0",
          });
        }
        setTimeout(() => {
          router.push("/creator");
        }, 1500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId || !confirm("Are you sure you want to delete this event?"))
      return;
    try {
      const res = await fetch(`/api/events/${editId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/creator");
      } else {
        setError("Failed to delete event");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#181c1e]">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-[#434656] mt-1">
          {isEditing
            ? "Update your event details below."
            : "Fill in the details below to publish your event."}
        </p>
      </header>

      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Title *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                event
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                placeholder="Global Innovators Summit 2024"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900 resize-none"
              placeholder="Describe your event, what attendees can expect..."
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date & Time *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  calendar_today
                </span>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                location_on
              </span>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                placeholder="Moscone Center, San Francisco"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                    form.category === cat
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-blue-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Image URL{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                image
              </span>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-slate-900"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                error
              </span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                check_circle
              </span>
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>{" "}
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {isEditing ? "save" : "add_circle"}
                  </span>{" "}
                  {isEditing ? "Update Event" : "Publish Event"}
                </>
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-3 rounded-xl font-semibold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatorPanelPage() {
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
      <CreatorPanelContent />
    </Suspense>
  );
}
