"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Router,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  fetchMyDeadlines,
  markDeadlineCompleteAsync,
} from "@/store/deadlineSlice";

export default function DeadlinesPage() {
  const dispatch = useDispatch();

  const { deadlines, loading, error } = useSelector((state) => state.deadline);
  const pending = deadlines?.upcoming || [];

  const completed = deadlines?.completed || [];

  const overdue = deadlines?.overdue || [];

  const counts = deadlines?.counts || {};
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchMyDeadlines());
  }, [dispatch]);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();

    const due = new Date(dueDate);

    const diffTime = due - today;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const getDaysLeftColor = (days) => {
    if (days < 0) return "text-red-400";
    if (days <= 3) return "text-orange-400";
    if (days <= 7) return "text-yellow-400";
    return "text-gray-300";
  };

  const renderDeadlineCard = (item) => (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: "var(--brand-bg)",
        borderColor: "var(--brand-primary)",
      }}
      className="border  rounded-2xl p-5 backdrop-blur-xl hover:bg-white/[0.07] transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              style={{ color: "var(--brand-accent)" }}
              className="text-lg font-semibold "
            >
              {item.title}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs border font-medium ${getPriorityStyles(item.priority)}`}
            >
              {item.priority}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs border capitalize font-medium ${getStatusStyles(item.status)}`}
            >
              {item.status}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-gray-300 text-sm">
              {item.university?.name || "University Not Assigned"}
            </p>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <CalendarDays size={15} />
              {new Date(item.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3">
          {item.status !== "completed" &&
            !(item.requiresDocumentUpload && !item.uploadedDocument?.url) && (
              <div
                className={`font-bold text-sm ${getDaysLeftColor(getDaysLeft(item.dueDate))}`}
              >
                {getDaysLeft(item.dueDate) < 0
                  ? `${Math.abs(getDaysLeft(item.dueDate))} days overdue`
                  : `${getDaysLeft(item.dueDate)} days left`}
              </div>
            )}

          <div className="flex flex-wrap gap-2">
            {item.category === "document" && (
              <button
                onClick={() => router.push("/dashboard/user/documents")}
                style={{ color: "var(--brand-accent)" }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700  text-sm font-medium transition-all"
              >
                <Upload size={16} />
                Upload
              </button>
            )}
            {item.status !== "completed" &&
              !(item.requiresDocumentUpload && !item.uploadedDocument?.url) && (
                <button
                  disabled={
                    item.requiresDocumentUpload && !item.uploadedDocument?.url
                  }
                  onClick={async () => {
                    try {
                      await dispatch(
                        markDeadlineCompleteAsync(item._id),
                      ).unwrap();

                      dispatch(fetchMyDeadlines());
                    } catch (err) {
                      alert(err);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-300 text-sm font-medium transition-all"
                >
                  <CheckCircle2 size={16} />
                  Mark Complete
                </button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div
        style={{ color: "var(--brand-accent)" }}
        className=" text-center py-20"
      >
        Loading deadlines...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-20">{error}</div>;
  }

  return (
    <div className="min-h-screen space-y-8 pt-16 sm:pt-5">
      {/* Header */}
      <div>
        <h1
          style={{ color: "var(--brand-accent)" }}
          className="text-3xl sm:text-4xl font-bold "
        >
          Deadlines & Tasks
        </h1>

        <p className="text-gray-400 mt-2">
          Track your university application progress and important tasks.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-blue-900/40 to-blue-950/20 border border-blue-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Tasks</p>
              <h3
                style={{ color: "var(--brand-accent)" }}
                className="text-3xl font-bold  mt-1"
              >
                {counts.pendingTasks || 0}
              </h3>
            </div>

            <Clock3 className="text-blue-400" size={30} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/20 border border-yellow-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming This Week</p>

              <h3
                style={{ color: "var(--brand-accent)" }}
                className="text-3xl font-bold  mt-1"
              >
                {counts.upcomingThisWeek || 0}
              </h3>
            </div>

            <CalendarDays className="text-yellow-400" size={30} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-red-900/40 to-red-950/20 border border-red-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>

              <h3
                style={{ color: "var(--brand-accent)" }}
                className="text-3xl font-bold  mt-1"
              >
                {counts.overdue || 0}
              </h3>
            </div>

            <AlertTriangle className="text-red-400" size={30} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-green-900/40 to-green-950/20 border border-green-500/20 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>

              <h3
                style={{ color: "var(--brand-accent)" }}
                className="text-3xl font-bold  mt-1"
              >
                {counts.completed || 0}
              </h3>
            </div>

            <CheckCircle2 className="text-green-400" size={30} />
          </div>
        </motion.div>
      </div>

      {/* Upcoming Tasks */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Clock3 className="text-blue-400" />
          <h2
            style={{ color: "var(--brand-accent)" }}
            className="text-2xl font-bold "
          >
            Upcoming Tasks
          </h2>
        </div>

        <div className="space-y-4">{pending.map(renderDeadlineCard)}</div>
      </section>

      {/* Overdue */}
      {overdue.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" />
            <h2
              style={{ color: "var(--brand-accent)" }}
              className="text-2xl font-bold "
            >
              Overdue Tasks
            </h2>
          </div>

          <div className="space-y-4">{overdue.map(renderDeadlineCard)}</div>
        </section>
      )}

      {/* Completed */}
      <section className="space-y-5 pb-10">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-400" />
          <h2
            style={{ color: "var(--brand-accent)" }}
            className="text-2xl font-bold "
          >
            Completed Tasks
          </h2>
        </div>

        <div className="space-y-4">{completed.map(renderDeadlineCard)}</div>
      </section>
    </div>
  );
}
