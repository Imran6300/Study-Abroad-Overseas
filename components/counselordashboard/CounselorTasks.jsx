"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, Loader2 } from "lucide-react";

const PRIORITY = {
  high: { label: "High", style: "bg-red-50 text-red-600 border-red-100" },
  medium: {
    label: "Medium",
    style: "bg-amber-50 text-amber-600 border-amber-100",
  },
  low: {
    label: "Low",
    style: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
};

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

async function apiFetch(method, path, body) {
  const res = await fetch(`${BASE}/api/counselor/tasks${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function CounselorTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [showInput, setShowInput] = useState(false);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  // Load tasks from backend
  useEffect(() => {
    apiFetch("GET", "")
      .then((data) => setTasks(data.data || []))
      .catch((err) => console.error("Tasks load error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const toggle = async (id, done) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, done: !done } : t)),
    );
    try {
      await apiFetch("PATCH", `/${id}`, { done: !done });
    } catch {
      // revert
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done } : t)));
    }
  };

  const remove = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await apiFetch("DELETE", `/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim() || saving) return;
    setSaving(true);
    try {
      const res = await apiFetch("POST", "", {
        text: newTask.trim(),
        priority: newPriority,
      });
      setTasks((prev) => [res.data, ...prev]);
      setNewTask("");
      setNewPriority("medium");
      setShowInput(false);
    } catch (err) {
      console.error("Add task failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const visible = tasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  function dueDateLabel(dueDate) {
    if (!dueDate) return "No date";
    const d = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((d - now) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff < 7) return `${diff}d left`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? "Loading..." : `${doneCount}/${tasks.length} completed`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInput((p) => !p)}
          className="w-8 h-8 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center justify-center shadow-sm transition-colors"
        >
          <Plus size={16} />
        </motion.button>
      </div>

      {/* Progress */}
      {!loading && tasks.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              Progress
            </span>
            <span className="text-xs font-bold text-sky-600">{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-1.5 mb-4">
        {["all", "pending", "done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f
                ? "bg-sky-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Add task input */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex gap-2 mb-2">
              <input
                ref={inputRef}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="New task… (press Enter)"
                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              />
              <button
                onClick={addTask}
                disabled={saving || !newTask.trim()}
                className="px-3 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {saving ? "..." : "Add"}
              </button>
            </div>
            <div className="flex gap-1.5">
              {["high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setNewPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize border transition-all ${
                    newPriority === p
                      ? PRIORITY[p].style + " ring-1 ring-current"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      <div
        className="flex-1 space-y-2 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-400" />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            {filter === "done"
              ? "No completed tasks yet"
              : filter === "pending"
                ? "All tasks done!"
                : "No tasks yet — add one above"}
          </div>
        ) : (
          <AnimatePresence>
            {visible.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                layout
                className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                  task.done
                    ? "bg-slate-50 border-slate-100 opacity-60"
                    : "bg-white border-slate-100 hover:border-sky-200 hover:bg-sky-50/30"
                }`}
              >
                <button
                  onClick={() => toggle(task._id, task.done)}
                  className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
                    task.done
                      ? "bg-sky-500 border-sky-500"
                      : "border-slate-300 hover:border-sky-400"
                  }`}
                >
                  {task.done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-snug ${
                      task.done
                        ? "line-through text-slate-400"
                        : "text-slate-700"
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        PRIORITY[task.priority]?.style
                      }`}
                    >
                      {PRIORITY[task.priority]?.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={9} />
                      {dueDateLabel(task.dueDate)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => remove(task._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
