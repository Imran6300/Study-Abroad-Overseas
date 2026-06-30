"use client";

/**
 * app/dashboard/org-admin/students/page.jsx
 *
 * Org-scoped student list. Admin sees ALL students across all counselors.
 * Clicking a row navigates to the full student detail page (reusing
 * the counselor student detail components).
 */

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchOrgStudents,
  selectOrgStudents,
  selectOrgStudentsPagination,
  selectOrgAdminLoading,
} from "@/store/orgAdminSlice";
import { GraduationCap, Search, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Stage badge (dark) ───────────────────────────────────────────────────────

const STAGE_COLORS = {
  lead: "bg-slate-500/15 text-slate-400",
  contacted: "bg-blue-500/15 text-blue-400",
  qualified: "bg-indigo-500/15 text-indigo-400",
  application_started: "bg-violet-500/15 text-violet-400",
  application_submitted: "bg-purple-500/15 text-purple-400",
  offer_received: "bg-amber-500/15 text-amber-400",
  visa_process: "bg-orange-500/15 text-orange-400",
  enrolled: "bg-emerald-500/15 text-emerald-400",
  lost: "bg-red-500/15 text-red-400",
};

function StageBadge({ stage }) {
  const label = stage?.replace(/_/g, " ") ?? "—";
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
        STAGE_COLORS[stage] ?? "bg-white/[0.06] text-white/40"
      }`}
    >
      {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrgStudentsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const students = useSelector(selectOrgStudents);
  const pagination = useSelector(selectOrgStudentsPagination);
  const loading = useSelector(selectOrgAdminLoading);

  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const params = { page, limit: 20 };
    if (search.trim()) params.search = search.trim();
    if (stage) params.stage = stage;
    dispatch(fetchOrgStudents(params));
  }, [dispatch, page, search, stage]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  // Navigate to student detail using user._id (same id the counselor detail
  // page expects). Falls back to lead _id for unregistered students.
  const handleRowClick = (s) => {
    // Always use the Lead._id — the detail page calls /api/org-admin/students/:id
    // which scopes by adminId using Lead._id, not User._id.
    const detailId = s._id;
    router.push(`/dashboard/org-admin/students/${detailId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Students</h1>
        <p className="text-sm text-white/40 mt-0.5">
          {pagination?.total ?? 0} total students across your organization
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-3 py-2.5 bg-[#0d2137] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={stage}
          onChange={(e) => {
            setStage(e.target.value);
            setPage(1);
          }}
          className="bg-[#0d2137] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors appearance-none pr-8 cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          <option value="" className="bg-[#0d2137]">
            All stages
          </option>
          <option value="lead" className="bg-[#0d2137]">
            Lead
          </option>
          <option value="contacted" className="bg-[#0d2137]">
            Contacted
          </option>
          <option value="qualified" className="bg-[#0d2137]">
            Qualified
          </option>
          <option value="application_started" className="bg-[#0d2137]">
            App Started
          </option>
          <option value="application_submitted" className="bg-[#0d2137]">
            Submitted
          </option>
          <option value="offer_received" className="bg-[#0d2137]">
            Offer Received
          </option>
          <option value="visa_process" className="bg-[#0d2137]">
            Visa Process
          </option>
          <option value="enrolled" className="bg-[#0d2137]">
            Enrolled
          </option>
          <option value="lost" className="bg-[#0d2137]">
            Lost
          </option>
        </select>
      </div>

      {/* Table */}
      {loading.students ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 bg-[#0d2137] border border-white/[0.06] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-white/15" />
          </div>
          <p className="text-white/60 font-semibold">No students found</p>
          <p className="text-sm text-white/25 mt-1">
            Students appear here as your counselors add them
          </p>
        </div>
      ) : (
        <div className="bg-[#0d2137] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                    Student
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden sm:table-cell">
                    Country
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                    Stage
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden md:table-cell">
                    Counselor
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden lg:table-cell">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {students.map((s) => (
                  <tr
                    key={s._id}
                    onClick={() => handleRowClick(s)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white/80 text-sm">
                        {s.name}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{s.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/50 hidden sm:table-cell">
                      {s.preferredCountry || (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={s.counselorStage} />
                    </td>
                    <td className="px-4 py-3 text-sm text-white/50 hidden md:table-cell">
                      {s.assignedCounselor?.name || (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/25 hidden lg:table-cell tabular-nums">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
              <p className="text-xs text-white/25 tabular-nums">
                Page {pagination.page} of {pagination.pages} ·{" "}
                {pagination.total} students
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:bg-white/[0.05] hover:text-white/70 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page >= pagination.pages}
                  className="p-1.5 rounded-lg border border-white/[0.08] text-white/40 hover:bg-white/[0.05] hover:text-white/70 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
