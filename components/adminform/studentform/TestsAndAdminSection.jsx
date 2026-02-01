export default function TestsAndAdminSection({ form, handleChange }) {
  return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Tests & Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              English Proficiency Test
            </label>
            <select
              name="englishTest"
              value={form.englishTest}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="None">None</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              <option value="PTE">PTE</option>
              <option value="Duolingo">Duolingo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Overall Score
            </label>
            <input
              name="englishScore"
              value={form.englishScore}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="e.g. 7.0 / 100 / 65 / 120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lead Source
            </label>
            <select
              name="leadSource"
              value={form.leadSource}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Source</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assigned Counselor
            </label>
            <select
              name="assignedCounselor"
              value={form.assignedCounselor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="">Select Counselor</option>
              <option value="Sara">Sara</option>
              <option value="John">John</option>
              <option value="Priya">Priya</option>
              <option value="Imran">Imran</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Status
            </label>
            <select
              name="currentStatus"
              value={form.currentStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
            >
              <option value="Lead">Lead</option>
              <option value="Counseling Done">Counseling Done</option>
              <option value="Shortlisted">Universities Shortlisted</option>
              <option value="Applications Submitted">Applications Submitted</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Visa Applied">Visa Applied</option>
              <option value="Enrolled">Enrolled</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks / Notes</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              placeholder="Any additional information..."
            />
          </div>
        </div>
      </div>
  );
}
