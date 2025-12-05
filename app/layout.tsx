import "./globals.css";
import NavBar from "../components/Header/nav-bar";
import Footer from "../components/Footer/Footer";
import type { ReactNode } from "react";

export const metadata = {
  title: "Overseas",
  description: "Study Abroad Website",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <header>
          <NavBar />
        </header>

        {children}

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
