// components/dashboard/RevenueOverview.jsx
export default function RevenueOverview() {
  return (
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
  );
}