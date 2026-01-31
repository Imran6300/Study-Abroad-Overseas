import "./globals.css";
import type { ReactNode } from "react";
import ReduxProvider from "@/store/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import AuthGate from "@/components/AuthGate";

export const metadata = {
  title: {
    default: "Khizar Overseas",
    template: "%s | Khizar Overseas",
  },
  description: "Study abroad guidance & university admissions",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <ReduxProvider>
          <AuthInitializer>
            <AuthGate>{children}</AuthGate>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
