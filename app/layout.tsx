import "./globals.css";
import NavBar from "../components/Header/nav-bar";
import Footer from "../components/Footer/Footer";
import AuthInitializer from "@/components/AuthInitializer";
import ReduxProvider from "@/store/ReduxProvider";
import type { ReactNode } from "react";

// app/layout.jsx
export const metadata = {
  title: {
    default: "Khizar Overseas",
    template: "%s | Khizar Overseas",
  },
  description: "Study abroad guidance & university admissions",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <ReduxProvider>
          <AuthInitializer>
        <header>
          <NavBar />
        </header>
        {children}

        <footer>
          <Footer />
        </footer>
        </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
