import { Shield, Loader2, Check } from "lucide-react";

export default function VisaInfoForm({
  visaInfo,
  setVisaInfo,
  handleSaveVisaInfo,
  saving,
  saved,
}) {
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-4">
      <h4 className="text-sm font-bold text-teal-800 flex items-center gap-2">
        <Shield size={14} className="text-teal-600" />
        Visa Application Details
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Visa Type
          </label>

          <input
            type="text"
            value={visaInfo.visaType}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                visaType: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            File / Application No.
          </label>

          <input
            type="text"
            value={visaInfo.fileNo}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                fileNo: e.target.value,
              }))
            }
            placeholder="e.g. IRCC-2026-XXXXXX"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Submission Date
          </label>

          <input
            type="date"
            value={visaInfo.submissionDate}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                submissionDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Decision Date
          </label>

          <input
            type="date"
            value={visaInfo.decisionDate}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                decisionDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Outcome
          </label>

          <select
            value={visaInfo.outcome}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                outcome: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            <option value="">— Select —</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Remarks
          </label>

          <input
            type="text"
            value={visaInfo.remarks}
            onChange={(e) =>
              setVisaInfo((v) => ({
                ...v,
                remarks: e.target.value,
              }))
            }
            placeholder="Any remarks or notes..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveVisaInfo}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${
            saved ? "bg-emerald-500" : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : null}

          {saving ? "Saving..." : saved ? "Saved!" : "Save Details"}
        </button>
      </div>
    </div>
  );
}
