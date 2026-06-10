// app/(site)/study-in/[slug]/layout.jsx
//
// Wraps CountryClient with the reCaptcha provider.
// The parent (site)/layout.tsx provides NavBar, Footer, and
// the staff-redirect logic — nothing extra needed here.

import Providers from "@/components/providers/Providers";

export default function StudyInLayout({ children }) {
  return <Providers>{children}</Providers>;
}
