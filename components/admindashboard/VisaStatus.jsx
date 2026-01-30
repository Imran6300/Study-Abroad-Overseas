// components/dashboard/VisaStatus.jsx
export default function VisaStatus() {
  const statuses = [
    { status: "Pending",    count: 18, color: "bg-yellow-500" },
    { status: "Processing", count: 22, color: "bg-blue-500" },
    { status: "Approved",   count: 31, color: "bg-green-500" },
    { status: "Rejected",   count: 4,  color: "bg-red-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-full">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Visa Status</h2>
      <div className="space-y-5">
        {statuses.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <span className="font-medium text-gray-700">{item.status}</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-gray-500">
          Success Rate: <span className="font-bold text-green-600">88%</span>
        </p>
      </div>
    </div>
  );
}