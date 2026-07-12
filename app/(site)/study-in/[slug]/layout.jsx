// app/(site)/study-in/[slug]/layout.jsx
//
// FIXED: this used to wrap children in its own <Providers> (a second
// GoogleReCaptchaProvider), on top of the one already provided globally
// by the root app/layout.tsx. Loading the reCAPTCHA script twice on the
// same page corrupts window.grecaptcha's internal state and causes
// "Could not connect to the reCAPTCHA service" errors. The root layout's
// <RecaptchaProvider> already covers every route, this one included, so
// nothing extra is needed here — just pass children through.

export default function StudyInLayout({ children }) {
  return children;
}
