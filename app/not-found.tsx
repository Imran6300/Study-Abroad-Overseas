// app/not-found.tsx
//
// Custom 404 page — replaces the default Vercel "404 | This page could not
// be found" interface with an on-brand, animated experience.
//
// Why no <img>/.gif file:
//   A hand-built SVG + CSS animation renders instantly, needs zero extra
//   network requests, stays crisp on retina screens, and can inherit the
//   brand gradient (#4A6BFF → #22C55E) already used across the app
//   (see app/error.jsx). A .gif would add page weight and can't do that.
//   The animation below (drifting clouds, a paper-plane gliding along a
//   dashed flight path, a gentle bobbing motion) reads exactly like a
//   looping GIF — but is a few KB of inline SVG instead of a media file.
//
// Placement: app/not-found.tsx (root). Next.js renders this for any
// unmatched route across the whole app, and it still mounts inside
// RootLayout (app/layout.tsx) — so ReduxProvider/AuthInitializer are
// already available, which means NavBar/Footer (both client components
// using useSelector) work here without any extra wiring.

import Link from "next/link";
import { FaGraduationCap, FaSearch, FaHome, FaPhoneAlt } from "react-icons/fa";
import NavBar from "@/components/Header/nav-bar";
import Footer from "@/components/Footer/Footer";

export const metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: true },
};

const POPULAR_DESTINATIONS = [
    { label: "Study in USA", href: "/study-in-usa" },
    { label: "Study in UK", href: "/study-in-uk" },
    { label: "Study in Canada", href: "/study-in-canada" },
    { label: "Study in Australia", href: "/study-in-australia" },
    { label: "Study in Germany", href: "/study-in-germany" },
];

const QUICK_LINKS = [
    { label: "Courses", href: "/courses" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Free Assessment", href: "/assessment" },
    { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
    return (
        <>
            <NavBar />

            <main className="relative min-h-[85vh] overflow-hidden bg-[#F7F9FC] flex items-center justify-center px-4 py-20">
                {/* ── Ambient drifting clouds (pure CSS, GIF-like loop) ── */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <CloudShape className="top-[12%] left-[6%] w-24 opacity-60 animate-[cloudDrift_22s_linear_infinite]" />
                    <CloudShape className="top-[22%] right-[10%] w-32 opacity-50 animate-[cloudDrift_28s_linear_infinite_reverse]" />
                    <CloudShape className="bottom-[18%] left-[12%] w-20 opacity-40 animate-[cloudDrift_18s_linear_infinite]" />
                    <CloudShape className="bottom-[10%] right-[8%] w-28 opacity-50 animate-[cloudDrift_26s_linear_infinite_reverse]" />

                    {/* soft brand-colored glow blobs */}
                    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#4A6BFF]/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#22C55E]/10 blur-3xl" />
                </div>

                <div className="relative w-full max-w-2xl text-center">
                    {/* Logo mark, matching error.jsx branding */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-md mx-auto mb-8">
                        <FaGraduationCap className="text-white text-2xl" />
                    </div>

                    {/* ── Flight-path illustration ── */}
                    <div className="relative h-40 sm:h-48 mb-6">
                        <svg
                            viewBox="0 0 600 200"
                            className="w-full h-full"
                            aria-hidden="true"
                        >
                            <path
                                id="flightPath"
                                d="M 30 160 Q 180 40 320 100 T 570 40"
                                fill="none"
                                stroke="#CBD5E1"
                                strokeWidth="3"
                                strokeDasharray="2 14"
                                strokeLinecap="round"
                            />
                            {/* animated plane gliding along the dashed path */}
                            <g
                                className="animate-[planeFly_6s_ease-in-out_infinite]"
                                style={{
                                    offsetPath: "path('M30,160 Q180,40 320,100 T570,40')",
                                    offsetRotate: "0deg",
                                }}
                            >
                                <g transform="translate(-18,-14) rotate(25)">
                                    <path
                                        d="M2 16 L34 2 L22 18 L26 28 L18 24 L12 30 L10 20 Z"
                                        fill="url(#planeGradient)"
                                    />
                                </g>
                            </g>
                            <defs>
                                <linearGradient id="planeGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#4A6BFF" />
                                    <stop offset="100%" stopColor="#22C55E" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* ── 404 headline ── */}
                    <h1 className="text-[76px] sm:text-[110px] leading-none font-extrabold bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] bg-clip-text text-transparent tracking-tight animate-[gentleBob_3.5s_ease-in-out_infinite]">
                        404
                    </h1>

                    <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
                        Looks like this page took a different flight
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                        The page you're looking for doesn't exist, may have moved, or the
                        link might be outdated. Let's get you back on course.
                    </p>

                    {/* ── Search box ── */}
                    <form
                        action="/search"
                        method="GET"
                        className="mt-8 max-w-md mx-auto flex items-center gap-2 bg-white rounded-full shadow-sm border border-gray-200 p-1.5 pl-5 focus-within:ring-2 focus-within:ring-[#4A6BFF]/30 transition-all"
                    >
                        <FaSearch className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search universities, courses, countries..."
                            className="flex-1 min-w-0 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                        />
                        <button
                            type="submit"
                            className="shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] hover:opacity-95 transition-all"
                        >
                            Search
                        </button>
                    </form>

                    {/* ── Primary actions ── */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#4A6BFF] to-[#22C55E] text-white hover:opacity-95 transition-all shadow-sm"
                        >
                            <FaHome /> Back to Home
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <FaPhoneAlt className="text-xs" /> Talk to a Counselor
                        </Link>
                    </div>

                    {/* ── Popular destinations ── */}
                    <div className="mt-10">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                            Popular Destinations
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {POPULAR_DESTINATIONS.map((d) => (
                                <Link
                                    key={d.href}
                                    href={d.href}
                                    className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-[#4A6BFF] hover:text-[#4A6BFF] transition-colors"
                                >
                                    {d.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick links ── */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {QUICK_LINKS.map((l, i) => (
                            <span key={l.href} className="flex items-center gap-5">
                                <Link
                                    href={l.href}
                                    className="text-xs sm:text-sm text-gray-400 hover:text-[#4A6BFF] transition-colors"
                                >
                                    {l.label}
                                </Link>
                                {i < QUICK_LINKS.length - 1 && (
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Scoped keyframes for the animations used above */}
            <style>{`
        @keyframes gentleBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(30px); }
        }
        @keyframes planeFly {
          0% { offset-distance: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
        </>
    );
}

function CloudShape({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 60"
            className={`absolute text-white drop-shadow-sm ${className}`}
            fill="currentColor"
        >
            <ellipse cx="30" cy="35" rx="26" ry="18" />
            <ellipse cx="55" cy="25" rx="22" ry="16" />
            <ellipse cx="72" cy="38" rx="20" ry="14" />
        </svg>
    );
}