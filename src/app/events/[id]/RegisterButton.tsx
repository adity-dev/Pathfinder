"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterButton({
  eventId,
  initialRegistered,
}: {
  eventId: number;
  initialRegistered: boolean;
}) {
  const router = useRouter();
  const [registered, setRegistered] = useState(initialRegistered);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const method = registered ? "DELETE" : "POST";
      const res = await fetch(`/api/events/${eventId}/register`, { method });
      const data = await res.json();

      if (res.ok) {
        setRegistered(!registered);
        setMessage(
          registered
            ? "You have cancelled your registration."
            : "🎉 You're registered!",
        );
        router.refresh();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          registered
            ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>{" "}
            Processing...
          </>
        ) : registered ? (
          <>
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>{" "}
            Registered — Cancel?
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">
              confirmation_number
            </span>{" "}
            Register Now
          </>
        )}
      </button>
      {message && (
        <p
          className={`text-xs text-center font-medium ${message.startsWith("🎉") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
