export default function StageSection({ data, updateForm }) {
  const stages = [
    "Lead / Enquiry",
    "Profile Completed",
    "Documents Pending",
    "Application Submitted",
    "Offer Received",
    "Visa Applied",
    "Visa Approved",
    "Enrolled / Completed",
    "Rejected / Lost",
  ];

  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Application Stage
      </h3>

      <select
        value={data.stage || ""}
        onChange={(e) => updateForm({ stage: e.target.value })}
        className={input}
      >
        {stages.map((stage) => (
          <option key={stage}>{stage}</option>
        ))}
      </select>
    </div>
  );
}
