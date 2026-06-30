"use client";

/**
 * app/dashboard/org-admin/counselors/page.jsx
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrgCounselors,
  inviteOrgCounselor,
  updateCounselorStatus,
  removeCounselor,
  selectOrgCounselors,
  selectOrgAdminLoading,
  selectOrgAdminError,
  clearOrgAdminError,
} from "@/store/orgAdminSlice";
import {
  UserPlus,
  Mail,
  MoreVertical,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Clock,
  Users,
} from "lucide-react";

// ─── Invite Modal (dark) ──────────────────────────────────────────────────────

function InviteModal({ open, onClose, onSubmit, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    setError("");
    const result = await onSubmit({ name: name.trim(), email: email.trim() });
    if (result?.meta?.requestStatus === "fulfilled") {
      setName("");
      setEmail("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#0d2137] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-base font-bold text-white mb-1">
          Invite Counselor
        </h2>
        <p className="text-xs text-white/40 mb-5">
          They will receive an activation email to set their password.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Riya Sharma"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="riya@example.com"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Counselor Row (dark) ─────────────────────────────────────────────────────

function CounselorRow({ counselor, onSuspend, onActivate, onRemove }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 bg-[#0d2137] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-200">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
        {counselor.name?.charAt(0)?.toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white/90 truncate">
            {counselor.name}
          </p>
          {!counselor.hasActivated && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-semibold">
              <Clock className="w-3 h-3" />
              Pending activation
            </span>
          )}
          {counselor.hasActivated && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                counselor.isActive
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {counselor.isActive ? "Active" : "Suspended"}
            </span>
          )}
        </div>
        <p className="text-xs text-white/30 truncate mt-0.5">
          {counselor.email}
        </p>
        {counselor.stats?.totalStudents > 0 && (
          <p className="text-[10px] text-white/20 mt-0.5 tabular-nums">
            {counselor.stats.totalStudents} students ·{" "}
            {counselor.stats.enrolled ?? 0} enrolled
          </p>
        )}
      </div>

      {/* Actions menu */}
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-xl transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-9 z-20 bg-[#0a1929] border border-white/[0.08] rounded-xl shadow-2xl py-1 w-44">
              {counselor.isActive ? (
                <button
                  onClick={() => {
                    onSuspend(counselor._id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-400 hover:bg-white/[0.05] transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => {
                    onActivate(counselor._id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-white/[0.05] transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Reactivate
                </button>
              )}
              <div className="my-1 border-t border-white/[0.05]" />
              <button
                onClick={() => {
                  if (
                    confirm(
                      `Remove ${counselor.name} from your organization? Their students will remain in the system.`,
                    )
                  ) {
                    onRemove(counselor._id);
                  }
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/[0.08] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrgCounselorsPage() {
  const dispatch = useDispatch();
  const counselors = useSelector(selectOrgCounselors);
  const loading = useSelector(selectOrgAdminLoading);
  const error = useSelector(selectOrgAdminError);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrgCounselors());
  }, [dispatch]);

  const handleInvite = (payload) => dispatch(inviteOrgCounselor(payload));
  const handleSuspend = (id) =>
    dispatch(updateCounselorStatus({ id, action: "suspend" }));
  const handleActivate = (id) =>
    dispatch(updateCounselorStatus({ id, action: "activate" }));
  const handleRemove = (id) => dispatch(removeCounselor(id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Counselors</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {counselors.length} member{counselors.length !== 1 ? "s" : ""} in
            your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(fetchOrgCounselors())}
            className="p-2 text-white/30 hover:text-white/70 hover:bg-white/[0.05] rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite Counselor
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400 flex items-center justify-between">
          {error}
          <button
            onClick={() => dispatch(clearOrgAdminError())}
            className="text-red-400/60 hover:text-red-400 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* List */}
      {loading.counselors ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] bg-[#0d2137] border border-white/[0.06] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : counselors.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-white/15" />
          </div>
          <p className="text-white/60 font-semibold">No counselors yet</p>
          <p className="text-sm text-white/25 mt-1 mb-5">
            Invite your first counselor to get started
          </p>
          <button
            onClick={() => setInviteOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Invite Counselor
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {counselors.map((c) => (
            <CounselorRow
              key={c._id}
              counselor={c}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
        loading={loading.invite}
      />
    </div>
  );
}
