// components/adminform/counselorform/AccountAndAccessSection.jsx
export default function AccountAndAccessSection({ form, handleChange, disabled = false }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-5 text-gray-800">
        Account & Access
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status *
          </label>
          <select
            name="status"
            value={form.status || "Active"}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Role *
          </label>
          <select
            name="role"
            value={form.role || "Counselor"}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="Counselor">Counselor</option>
            <option value="Senior Counselor">Senior Counselor</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Branch Manager">Branch Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Username / Login Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Username / Login Email *
          </label>
          <input
            type="email"
            name="username"
            value={form.username || ""}
            onChange={handleChange}
            disabled={disabled}
            placeholder="e.g. sara.counselor@overseas.com"
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Password – only shown when adding a new counselor */}
        {!disabled && form.id === undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password (for new counselor) *
            </label>
            <input
              type="password"
              name="password"
              value={form.password || ""}
              onChange={handleChange}
              required
              placeholder="Enter a secure password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            />
          </div>
        )}

        {/* Remarks / Internal Notes */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Internal Notes / Remarks
          </label>
          <textarea
            name="remarks"
            value={form.remarks || ""}
            onChange={handleChange}
            disabled={disabled}
            rows={3}
            placeholder="Any additional information about this counselor..."
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}