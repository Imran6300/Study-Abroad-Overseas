// components/dashboard/UpcomingDeadlines.jsx
export default function UpcomingDeadlines() {
  const tasks = [
    { task: "Visa submission – Ayesha Khan (Canada)", date: "Tomorrow",     priority: "high" },
    { task: "University deposit – Rahul Sharma (Australia)", date: "In 3 days", priority: "medium" },
    { task: "Offer acceptance – Priya Patel (UK)", date: "This Friday",    priority: "medium" },
    { task: "Document follow-up – Mohammed Ali", date: "Next Monday",      priority: "low" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Upcoming Deadlines</h2>
      <div className="space-y-4">
        {tasks.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.task}</p>
              <p className="text-sm text-gray-600">{item.date}</p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.priority === "high"   ? "bg-red-100 text-red-700" :
                item.priority === "medium" ? "bg-orange-100 text-orange-700" :
                "bg-green-100 text-green-700"
              }`}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}