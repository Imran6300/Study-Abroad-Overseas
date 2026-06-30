"use client";

/**
 * app/dashboard/org-admin/applications/page.jsx
 *
 * Org-scoped applications list. Admin sees ALL applications across all counselors.
 * Read-only view with search + status filter + pagination.
 */

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrgApplications,
  selectOrgApplications,
  selectOrgAdminLoading,
} from "@/store/orgAdminSlice";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

// ─── Status badge (dark) ──────────────────────────────────────────────────────

const STATUS_MAP = {
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-400" },
  reviewing: { label: "Reviewing", cls: "bg-blue-500/15 text-blue-400" },
  accepted: { label: "Accepted", cls: "bg-emerald-500/15 text-emerald-400" },
  rejected: { label: "Rejected", cls: "bg-red-500/15 text-red-400" },
  enrolled: { label: "Enrolled", cls: "bg-purple-500/15 text-purple-400" },
  completed: { label: "Completed", cls: "bg-teal-500/15 text-teal-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? {
    label: status ?? "—",
    cls: "bg-white/[0.06] text-white/40",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  "pending",
  "reviewing",
  "accepted",
  "rejected",
  "enrolled",
  "completed",
];

export default function OrgApplicationsPage() {
  const dispatch = useDispatch();
  const applications = useSelector(selectOrgApplications);
  const loading = useSelector(selectOrgAdminLoading);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    const params = { page, limit: 20 };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    const result = await dispatch(fetchOrgApplications(params));
    if (result?.payload?.pagination) {
      setTotal(result.payload.pagination.total);
      setPages(result.payload.pagination.pages);
    }
  }, [dispatch, page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Applications</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {total} total applications across your organization
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
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
              placeholder="Search by student name or university..."
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
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
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
            All statuses
          </option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-[#0d2137] capitalize">
              {STATUS_MAP[s]?.label ?? s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading.applications ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 bg-[#0d2137] border border-white/[0.06] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-white/15" />
          </div>
          <p className="text-white/60 font-semibold">No applications found</p>
          <p className="text-sm text-white/25 mt-1">
            {search || status
              ? "Try clearing your filters"
              : "Applications will appear here as counselors submit them"}
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
                    University
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden md:table-cell">
                    Course
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden md:table-cell">
                    Counselor
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {applications.map((app) => {
                  const studentName = app.studentSnapshot?.name ?? "Student";
                  const counselorName = app.counselorId?.name ?? null;
                  const dateStr = app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })
                    : "—";
                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white/80 text-sm">
                          {studentName}
                        </p>
                        {app.studentSnapshot?.email && (
                          <p className="text-xs text-white/25 mt-0.5 truncate max-w-[160px]">
                            {app.studentSnapshot.email}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-white/60 truncate max-w-[180px]">
                          {app.university || (
                            <span className="text-white/20">—</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/50 hidden md:table-cell">
                        <p className="truncate max-w-[140px]">
                          {app.course || (
                            <span className="text-white/20">—</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-white/50 hidden md:table-cell">
                        {counselorName || (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-white/25 hidden lg:table-cell tabular-nums">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
              <p className="text-xs text-white/25 tabular-nums">
                Page {page} of {pages} · {total} applications
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
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
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
