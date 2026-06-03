// components/counselordashboard/CounselorStudentsTable.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";
import { useRouter } from "next/navigation";

const STATUS_STYLES = {
  lead: "bg-slate-100 text-slate-600",
  contacted: "bg-blue-50 text-blue-600",
  qualified: "bg-violet-50 text-violet-600",
  application_started: "bg-sky-50 text-sky-600",
  application_submitted: "bg-sky-50 text-sky-600",
  offer_received: "bg-amber-50 text-amber-600",
  visa_process: "bg-fuchsia-50 text-fuchsia-600",
  enrolled: "bg-emerald-50 text-emerald-600",
  lost: "bg-red-50 text-red-500",
};

const STAGE_LABEL = {
  lead: "Lead",
  contacted: "Contacted",
  qualified: "Counseled",
  application_started: "App Started",
  application_submitted: "Applied",
  offer_received: "Offer",
  visa_process: "Visa",
  enrolled: "Enrolled",
  lost: "Lost",
};

const AVATAR_COLORS = [
  "from-sky-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-pink-400",
  "from-amber-400 to-orange-400",
  "from-blue-500 to-indigo-400",
];

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??"
  );
}

const COUNTRY_FLAGS = {
  canada: "🇨🇦",
  uk: "🇬🇧",
  usa: "🇺🇸",
  australia: "🇦🇺",
  germany: "🇩🇪",
  "new zealand": "🇳🇿",
  france: "🇫🇷",
  ireland: "🇮🇪",
  singapore: "🇸🇬",
  india: "🇮🇳",
};

export default function CounselorStudentsTable() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await counselorApi.getStudents({
        page,
        limit: 10,
        search: debouncedSearch,
        stage: stageFilter,
        sortBy: sortField,
        order: sortDir,
      });
      setStudents(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error("Students load error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, stageFilter, sortField, sortDir]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => (
    <span className="inline-flex flex-col ml-1 opacity-40">
      <ChevronUp
        size={10}
        className={
          sortField === field && sortDir === "asc"
            ? "opacity-100 text-sky-500"
            : ""
        }
      />
      <ChevronDown
        size={10}
        className={
          sortField === field && sortDir === "desc"
            ? "opacity-100 text-sky-500"
            : ""
        }
        style={{ marginTop: -3 }}
      />
    </span>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Students</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {loading ? "Loading..." : `${pagination.total} students assigned`}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All Stages</option>
            {Object.entries(STAGE_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              router.push("/dashboard/counselor-dashboard/students")
            }
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-200 transition-all duration-200 shrink-0"
          >
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              {[
                { key: "name", label: "Student" },
                { key: "preferredCountry", label: "Country" },
                { key: null, label: "Program" },
                { key: "counselorStage", label: "Status" },
                { key: "createdAt", label: "Joined" },
                { key: null, label: "" },
              ].map((col) => (
                <th
                  key={col.label || "actions"}
                  onClick={() => col.key && handleSort(col.key)}
                  className={`text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider ${col.key ? "cursor-pointer hover:text-sky-600 transition-colors select-none" : ""}`}
                >
                  {col.label}
                  {col.key && <SortIcon field={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [0, 1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-slate-50">
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <AnimatePresence>
                {students.map((student, i) => {
                  const flag =
                    COUNTRY_FLAGS[
                      (student.preferredCountry || "").toLowerCase()
                    ] || "🌍";
                  const stageLabel =
                    STAGE_LABEL[student.counselorStage] ||
                    student.counselorStage ||
                    "—";
                  const stageStyle =
                    STATUS_STYLES[student.counselorStage] ||
                    "bg-slate-100 text-slate-600";
                  return (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors group cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/dashboard/counselor-dashboard/students/${student._id}`,
                        )
                      }
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}
                          >
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600 flex items-center gap-1.5">
                          <span className="text-base">{flag}</span>
                          {student.preferredCountry || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {student.application?.isDraft === false
                            ? "Applied"
                            : student.preferredIntake || "Not specified"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${stageStyle}`}
                        >
                          {stageLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500 font-medium">
                          {new Date(student.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-sky-100 text-slate-400 hover:text-sky-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/counselor-dashboard/students/${student._id}`,
                            );
                          }}
                        >
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {!loading && students.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm">
          No students match your search.
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon size={16} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
