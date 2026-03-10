import Header from "@/components/Header/nav-bar";
import DashboardSidebar from "@/components/userdashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col">
      {/* Top Navbar */}
      <Header />

      {/* Dashboard Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 pt-20 pb-10 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
