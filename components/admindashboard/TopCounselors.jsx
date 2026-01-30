// components/dashboard/TopCounselors.jsx
export default function TopCounselors() {
  const counselors = [
    { name: "Sarah Ahmed",  enrollments: 14, leads: 62 },
    { name: "Vikram Singh", enrollments: 11, leads: 58 },
    { name: "Neha Kapoor",  enrollments: 9,  leads: 45 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Top Counselors</h2>
      <div className="space-y-4">
        {counselors.map((counselor, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                {counselor.name[0]}
              </div>
              <span className="font-medium">{counselor.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{counselor.enrollments} enrolled</p>
              <p className="text-xs text-gray-500">{counselor.leads} leads</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}