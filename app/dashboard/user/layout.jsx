import Header from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";

export default function AuthLayout({ children }) {
  return (
    <>
      <Header />
        {children}  
      <Footer/>
    </>
  );
}
