// components/dashboard/StudentPipeline.jsx
export default function StudentPipeline() {
  const stages = [
    { stage: "Leads",           count: 248, color: "bg-blue-600" },
    { stage: "Contacted",        count: 192, color: "bg-blue-700" },
    { stage: "Counseled",        count: 145, color: "bg-indigo-600" },
    { stage: "Applied",          count: 87,  color: "bg-indigo-700" },
    { stage: "Offers",           count: 62,  color: "bg-purple-600" },
    { stage: "Visa Processing",  count: 48,  color: "bg-purple-700" },
    { stage: "Enrolled",         count: 42,  color: "bg-green-600" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Student Pipeline – This Month
      </h2>

      <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-stretch overflow-x-auto pb-2">
        {stages.map((item, idx) => (
          <div
            key={item.stage}
            className="flex-1 min-w-[140px] bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div
              className={`w-14 h-14 mx-auto rounded-full ${item.color} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm`}
            >
              {item.count}
            </div>
            <p className="text-sm font-medium text-gray-700">{item.stage}</p>
            {idx < stages.length - 1 && (
              <div className="hidden md:block text-gray-300 text-2xl mt-4">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}