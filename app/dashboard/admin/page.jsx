"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminCard from "@/components/AdminCard";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar + its spacer */}
      <AdminSidebar />

      {/* Main content area */}
<div className="flex-1 flex flex-col">
  {/* Top header bar */}
  <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
    <h1 className="text-2xl font-bold text-gray-900">Overseas Admin Dashboard</h1>
    <div className="flex items-center gap-6">
      <span className="text-sm text-gray-600 hidden sm:block">Welcome back, Imran</span>
      {/* Placeholder for future features */}
      <button className="text-gray-500 hover:text-gray-700">
        <span className="text-xl">🔔</span>
      </button>
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
        I
      </div>
    </div>
  </header>

  <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50">
    {/* KPI Cards – Quick glance */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <AdminCard 
        title="New Leads (This Month)" 
        value="248" 
        icon="👥"
        trend="+18%"
      />
      <AdminCard 
        title="Conversion Rate" 
        value="24.6%" 
        icon="📈"
        trend="-2.1%"
      />
      <AdminCard 
        title="Applications Submitted" 
        value="87" 
        icon="📄"
        trend="+12%"
      />
      <AdminCard 
        title="Enrollments Confirmed" 
        value="42" 
        icon="🎓"
        trend="+9%"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Left – Pipeline (now takes more space) */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Student Pipeline – This Month</h2>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-stretch overflow-x-auto pb-2">
          {[
            { stage: "Leads", count: 248, color: "bg-blue-600" },
            { stage: "Contacted", count: 192, color: "bg-blue-700" },
            { stage: "Counseled", count: 145, color: "bg-indigo-600" },
            { stage: "Applied", count: 87, color: "bg-indigo-700" },
            { stage: "Offers", count: 62, color: "bg-purple-600" },
            { stage: "Visa Processing", count: 48, color: "bg-purple-700" },
            { stage: "Enrolled", count: 42, color: "bg-green-600" },
          ].map((item, idx) => (
            <div 
              key={item.stage}
              className="flex-1 min-w-[140px] bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-14 h-14 mx-auto rounded-full ${item.color} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm`}>
                {item.count}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.stage}</p>
              {idx < 6 && (
                <div className="hidden md:block text-gray-300 text-2xl mt-4">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right – Visa Status Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Visa Status</h2>
        <div className="space-y-5">
          {[
            { status: "Pending", count: 18, color: "bg-yellow-500" },
            { status: "Processing", count: 22, color: "bg-blue-500" },
            { status: "Approved", count: 31, color: "bg-green-500" },
            { status: "Rejected", count: 4, color: "bg-red-500" },
          ].map((item) => (
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
          <p className="text-sm text-gray-500">Success Rate: <span className="font-bold text-green-600">88%</span></p>
        </div>
      </div>
    </div>

    {/* Bottom sections – two columns */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Deadlines & Tasks */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Upcoming Deadlines</h2>
        <div className="space-y-4">
          {[
            { task: "Visa submission – Ayesha Khan (Canada)", date: "Tomorrow", priority: "high" },
            { task: "University deposit – Rahul Sharma (Australia)", date: "In 3 days", priority: "medium" },
            { task: "Offer acceptance – Priya Patel (UK)", date: "This Friday", priority: "medium" },
            { task: "Document follow-up – Mohammed Ali", date: "Next Monday", priority: "low" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.task}</p>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                item.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Snapshot + Counselor Quick View */}
      <div className="space-y-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Revenue Overview</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Booked This Month</p>
              <p className="text-2xl font-bold text-green-700 mt-1">₹12.4 Lakh</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected (Pending)</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">₹8.7 Lakh</p>
            </div>
          </div>
        </div>

        {/* Top Counselors */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">Top Counselors</h2>
          <div className="space-y-4">
            {[
              { name: "Sarah Ahmed", enrollments: 14, leads: 62 },
              { name: "Vikram Singh", enrollments: 11, leads: 58 },
              { name: "Neha Kapoor", enrollments: 9, leads: 45 },
            ].map((counselor, i) => (
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
      </div>
    </div>
  </main>
</div>
    </div>
  );
}