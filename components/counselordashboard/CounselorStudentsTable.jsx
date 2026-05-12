"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

const STATUS_STYLES = {
  Leads: "bg-slate-100 text-slate-600",
  Contacted: "bg-blue-50 text-blue-600",
  Counseled: "bg-violet-50 text-violet-600",
  Applied: "bg-sky-50 text-sky-600",
  Offer: "bg-amber-50 text-amber-600",
  Visa: "bg-fuchsia-50 text-fuchsia-600",
  Enrolled: "bg-emerald-50 text-emerald-600",
};

const FLAG = {
  Canada: "🇨🇦",
  UK: "🇬🇧",
  USA: "🇺🇸",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  NZ: "🇳🇿",
};

const STUDENTS = [
  {
    id: 1,
    name: "Ahmed Khan",
    avatar: "AK",
    country: "Canada",
    status: "Applied",
    intake: "Fall 2026",
    program: "Computer Science",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "PS",
    country: "UK",
    status: "Offer",
    intake: "Spring 2026",
    program: "MBA",
  },
  {
    id: 3,
    name: "Ali Hassan",
    avatar: "AH",
    country: "Australia",
    status: "Visa",
    intake: "Summer 2026",
    program: "Engineering",
  },
  {
    id: 4,
    name: "Fatima Noor",
    avatar: "FN",
    country: "USA",
    status: "Counseled",
    intake: "Winter 2026",
    program: "Medicine",
  },
  {
    id: 5,
    name: "Riya Patel",
    avatar: "RP",
    country: "Canada",
    status: "Enrolled",
    intake: "Fall 2025",
    program: "Data Science",
  },
  {
    id: 6,
    name: "Omar Sheikh",
    avatar: "OS",
    country: "Germany",
    status: "Applied",
    intake: "Fall 2026",
    program: "Automotive Eng.",
  },
];

const AVATAR_COLORS = [
  "from-sky-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-pink-400",
  "from-amber-400 to-orange-400",
  "from-blue-500 to-indigo-400",
];

export default function CounselorStudentsTable() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.status.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) => {
    if (!sortField) return 0;
    const va = a[sortField],
      vb = b[sortField];
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

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
            {filtered.length} students assigned
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-200 transition-all duration-200 shrink-0">
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
                { key: "country", label: "Country" },
                { key: "program", label: "Program" },
                { key: "status", label: "Status" },
                { key: "intake", label: "Intake" },
                { key: null, label: "" },
              ].map((col) => (
                <th
                  key={col.label}
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
            <AnimatePresence>
              {filtered.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}
                      >
                        {student.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 flex items-center gap-1.5">
                      <span className="text-base">
                        {FLAG[student.country] || "🌍"}
                      </span>
                      {student.country}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {student.program}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_STYLES[student.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-500 font-medium">
                      {student.intake}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-sky-100 text-slate-400 hover:text-sky-600">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm">
          No students match your search.
        </div>
      )}
    </div>
  );
}
