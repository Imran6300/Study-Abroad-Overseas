// components/dashboard/DashboardHeader.jsx
export default function DashboardHeader({ title, counselorName }) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-600 hidden sm:block">{`Welcome Back, ${counselorName}`}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
          {counselorName[0]}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors whitespace-nowrap">
            + Add New Student
          </button>
        </div>
      </div>
    </header>
  );
}
