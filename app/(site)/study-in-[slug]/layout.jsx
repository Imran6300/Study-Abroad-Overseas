// app/(site)/study-in-[slug]/layout.jsx
//
// MUST match the pattern used by all-countries/[country]/layout.jsx
// which also wraps with Providers to skip the (site)/layout.tsx auth gate.
// Without this file, (site)/layout.tsx runs and returns null while
// authChecked=false → Next.js Turbopack compiles /_not-found → 404.

import Providers from "@/components/providers/Providers";
import NavBar from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";

// app/(site)/study-in-[slug]/layout.jsx
export default function StudyInLayout({ children }) {
  return children;
}
