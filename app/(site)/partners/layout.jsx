export const metadata = {
  title: "Partner With Us | Study Abroad Platform",
  description:
    "Grow your study abroad business with AI-powered tools, white-label dashboards, and streamlined student management.",
};

export default function PartnersLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#071226] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient blobs */}
        <div className="absolute top-[-120px] left-[-100px] w-[350px] h-[350px] bg-[#4169E1]/20 blur-3xl rounded-full" />

        <div className="absolute top-[30%] right-[-120px] w-[350px] h-[350px] bg-[#32CD32]/10 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] left-[20%] w-[320px] h-[320px] bg-[#FF8C00]/15 blur-3xl rounded-full" />

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {children}
    </div>
  );
}
