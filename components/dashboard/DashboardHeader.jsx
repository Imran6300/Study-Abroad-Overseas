// components/dashboard/DashboardHeader.jsx
export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
      <h1 className="text-2xl font-bold text-gray-900">Overseas Admin Dashboard</h1>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 hidden sm:block">Welcome back, Imran</span>
        <button className="text-gray-500 hover:text-gray-700">
          <span className="text-xl">🔔</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
          I
        </div>
      </div>
    </header>
  );
}