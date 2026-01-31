import Header from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F9FC]">
        {children}
      </div>
      <Footer/>
    </>
  );
}
