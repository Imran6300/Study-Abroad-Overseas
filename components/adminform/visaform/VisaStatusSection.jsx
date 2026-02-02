import { statusOptions } from "./visaStatusOptions";

export default function VisaStatusSection({ status, setStatus, mode }) {
  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const style =
    statusOptions.find(s => s.value === status)?.color || "bg-gray-100";

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {isAdd ? "Initial Visa Status" : isEdit ? "Update Visa Status" : "Current Visa Status"}
          </h3>
        </div>

        {isView ? (
          <span className={`px-6 py-2 rounded-full ${style}`}>
            {status}
          </span>
        ) : (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`px-4 py-3 rounded-xl border ${style}`}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
