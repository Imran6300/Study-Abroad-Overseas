// components/dashboard/KpiCards.jsx
import AdminCard from "@/components/dashboard/AdminCard";

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <AdminCard title="New Leads (This Month)" value="248"  icon="👥" trend="+18%" />
      <AdminCard title="Conversion Rate"       value="24.6%" icon="📈" trend="-2.1%" />
      <AdminCard title="Applications Submitted" value="87"   icon="📄" trend="+12%" />
      <AdminCard title="Enrollments Confirmed"  value="42"   icon="🎓" trend="+9%" />
    </div>
  );
}