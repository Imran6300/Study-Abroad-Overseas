"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  MessageCircle,
  Link,
  Loader2,
  CheckCircle,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const TYPE_CONFIG = {
  video_call: {
    label: "Video Call",
    icon: Video,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  phone_call: {
    label: "Phone Call",
    icon: Phone,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  in_person: {
    label: "In Person",
    icon: MapPin,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

function timeUntil(date) {
  const diff = new Date(date) - new Date();
  if (diff < 0) return "Started";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `In ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `In ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `In ${days}d`;
}

export default function CounselingPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/counselor/meetings/my-meetings`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : Promise.resolve({ data: [] })))
      .then((d) => setMeetings(d.data || []))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Expert Counseling
        </h1>
        <p className="text-slate-400 text-sm">
          Your scheduled sessions with your counselor
        </p>
      </div>

      {/* Upcoming meetings */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Upcoming Sessions</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={22} className="animate-spin text-slate-400" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 text-center">
            <Calendar
              size={32}
              className="mx-auto text-slate-400 mb-3 opacity-50"
            />
            <p className="text-slate-300 font-medium">
              No meetings scheduled yet
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Your counselor will schedule sessions here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((m, i) => {
              const cfg = TYPE_CONFIG[m.meetingType] || TYPE_CONFIG.video_call;
              const Icon = cfg.icon;
              const dt = new Date(m.scheduledAt);
              const isImminent =
                dt - new Date() < 30 * 60000 && dt - new Date() > 0;

              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white/5 backdrop-blur border rounded-2xl p-5 transition-all ${
                    isImminent
                      ? "border-blue-400/50 bg-blue-500/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-bold text-white">{m.title}</p>
                        {isImminent && (
                          <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full animate-pulse">
                            <CheckCircle size={10} /> Starting soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">
                        with {m.counselor?.name || "Your Counselor"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {dt.toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {dt.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ({timeUntil(m.scheduledAt)})
                        </span>
                        <span className="text-slate-500">
                          {m.durationMinutes} min
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {m.meetingLink && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        <Link size={13} /> Join {cfg.label}
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
