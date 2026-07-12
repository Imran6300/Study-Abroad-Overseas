// app/(site)/all-countries/[country]/layout.jsx
//
// FIXED: same issue as study-in/[slug]/layout.jsx — this used to wrap
// children in a second GoogleReCaptchaProvider via <Providers>, duplicating
// the one already supplied globally by the root app/layout.tsx. That double
// script load is what caused "Could not connect to the reCAPTCHA service."
// Removed; the root layout already covers this route.

export default function CountryLayout({ children }) {
  return children;
}
