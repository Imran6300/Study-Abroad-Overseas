import "./globals.css";
import type { ReactNode } from "react";
import ReduxProvider from "@/store/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";
import AuthGate from "@/components/AuthGate";
import Script from "next/script";

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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1W7JC83PF0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1W7JC83PF0');
          `}
        </Script>
      </body>
    </html>
  );
}

