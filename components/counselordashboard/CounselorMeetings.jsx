"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  MessageCircle,
  Plus,
  X,
  Loader2,
  CheckCircle,
  Edit2,
  Trash2,
  Link,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";
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

const STATUS_STYLES = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-amber-50 text-amber-700 border-amber-200",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  scheduledAt: "",
  durationMinutes: 30,
  meetingType: "video_call",
  meetingLink: "",
  leadId: "",
  notes: "",
};

export default function CounselorMeetings({ leads = [] }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const [viewMode, setViewMode] = useState("list"); // list | calendar
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const params =
        filter === "upcoming"
          ? `?from=${new Date().toISOString()}&status=scheduled`
          : filter === "past"
            ? `?to=${new Date().toISOString()}`
            : "";
      const query = {};

      if (filter === "upcoming") {
        query.from = new Date().toISOString();
        query.status = "scheduled";
      }

      if (filter === "past") {
        query.to = new Date().toISOString();
      }

      const data = await counselorApi.getMeetings(query);
      setMeetings(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const save = async () => {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.scheduledAt) {
      setError("Date & time is required");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const res = await counselorApi.updateMeeting(editId, form);
        setMeetings((prev) =>
          prev.map((m) => (m._id === editId ? res.data : m)),
        );
      } else {
        const res = await counselorApi.createMeeting(form);
        setMeetings((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await counselorApi.updateMeeting(id, { status });
      setMeetings((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Cancel this meeting?")) return;
    try {
      await counselorApi.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (m) => {
    setForm({
      title: m.title,
      description: m.description || "",
      scheduledAt: new Date(m.scheduledAt).toISOString().slice(0, 16),
      durationMinutes: m.durationMinutes,
      meetingType: m.meetingType,
      meetingLink: m.meetingLink || "",
      leadId: m.lead?._id || "",
      notes: m.notes || "",
    });
    setEditId(m._id);
    setShowForm(true);
    setError("");
  };

  // Calendar helpers
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const meetingsOnDay = (day) => {
    const d = new Date(calYear, calMonth, day);
    return meetings.filter((m) => {
      const md = new Date(m.scheduledAt);
      return (
        md.getDate() === day &&
        md.getMonth() === calMonth &&
        md.getFullYear() === calYear
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meetings</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setViewMode((v) => (v === "list" ? "calendar" : "list"))
            }
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(EMPTY_FORM);
              setError("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={15} /> New Meeting
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {["upcoming", "past", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Calendar view */}
      {viewMode === "calendar" && (
        <div className="mb-6 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() =>
                setCalendarDate(new Date(calYear, calMonth - 1, 1))
              }
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold text-slate-700">
              {monthNames[calMonth]} {calYear}
            </span>
            <button
              onClick={() =>
                setCalendarDate(new Date(calYear, calMonth + 1, 1))
              }
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="font-semibold">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`e${i}`} />
              ))}
            {Array(daysInMonth)
              .fill(null)
              .map((_, i) => {
                const day = i + 1;
                const dayMeetings = meetingsOnDay(day);
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === calMonth &&
                  new Date().getFullYear() === calYear;
                return (
                  <div
                    key={day}
                    className={`min-h-[36px] rounded-lg p-1 text-xs ${isToday ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"}`}
                  >
                    <span
                      className={`block text-center font-medium ${isToday ? "text-blue-600" : ""}`}
                    >
                      {day}
                    </span>
                    {dayMeetings.slice(0, 2).map((m) => (
                      <div
                        key={m._id}
                        className="mt-0.5 text-[9px] bg-blue-100 text-blue-700 rounded px-1 truncate"
                      >
                        {m.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-[9px] text-slate-400 text-center">
                        +{dayMeetings.length - 2}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Meeting list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={22} className="animate-spin text-slate-400" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter} meetings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => {
            const TypeIcon = TYPE_CONFIG[m.meetingType]?.icon || Video;
            const dateStr = new Date(m.scheduledAt).toLocaleString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <motion.div
                key={m._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${TYPE_CONFIG[m.meetingType]?.bg || "bg-slate-50"} flex items-center justify-center shrink-0`}
                >
                  <TypeIcon
                    size={18}
                    className={
                      TYPE_CONFIG[m.meetingType]?.color || "text-slate-500"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 truncate">
                        {m.title}
                      </p>
                      {m.lead && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          📋 {m.lead.name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0 ${STATUS_STYLES[m.status]}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {m.durationMinutes}min
                    </span>
                    {m.meetingLink && (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Link size={11} /> Join
                      </a>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {m.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {m.status === "scheduled" && (
                    <button
                      onClick={() => updateStatus(m._id, "completed")}
                      title="Mark completed"
                      className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors"
                    >
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(m)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => remove(m._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setError("");
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-800">
                  {editId ? "Edit Meeting" : "New Meeting"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Initial Counseling Session"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, scheduledAt: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                      Duration (min)
                    </label>
                    <select
                      value={form.durationMinutes}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          durationMinutes: +e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 outline-none"
                    >
                      {[15, 30, 45, 60, 90, 120].map((d) => (
                        <option key={d} value={d}>
                          {d} min
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={key}
                          onClick={() =>
                            setForm((p) => ({ ...p, meetingType: key }))
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${
                            form.meetingType === key
                              ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon size={14} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {leads.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                      Link to Student (optional)
                    </label>
                    <select
                      value={form.leadId}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, leadId: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 outline-none"
                    >
                      <option value="">— No student —</option>
                      {leads.map((l) => (
                        <option key={l._id} value={l._id}>
                          {l.name} ({l.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Meeting Link
                  </label>
                  <input
                    value={form.meetingLink}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, meetingLink: e.target.value }))
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={3}
                    placeholder="Topics to discuss..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editId ? "Save Changes" : "Schedule Meeting"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
