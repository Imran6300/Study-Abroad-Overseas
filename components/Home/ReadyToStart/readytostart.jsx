"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Phone, Mail, User, Globe2, Send, MessageCircle } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import MessageBox from "@/components/ui/MessageBox";

export default function FinalCTASection() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authChecked } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(user);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [messageBox, setMessageBox] = useState({
    status: null,
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    if (authChecked && isLoggedIn && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
    if (authChecked && !isLoggedIn) {
      setForm({ name: "", email: "", phone: "", country: "" });
    }
  }, [authChecked, isLoggedIn, user]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!authChecked) return;

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      if (!executeRecaptcha) {
        alert("Captcha not ready");
        return;
      }

      const captchaToken = await executeRecaptcha("lead_submit");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ⭐ VERY IMPORTANT
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            preferredCountry: form.country,
            leadSource: "homepage",
            captchaToken,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed");

      setMessageBox({
        status: "success",
        message: "Your counseling request has been submitted!",
      });
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        country: "",
      });
    } catch (err) {
      setMessageBox({
        status: "error",
        message: `Something went wrong: ${err.message}`,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <MessageBox
        status={messageBox.status}
        message={messageBox.message}
        onClose={() => setMessageBox({ status: null, message: "" })}
      />
      <section className="w-full py-16 md:py-24 lg:py-32 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#0A1124] to-[#0D1428]">
        {/* Glow Effects - Scaled properly */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#4169E1]/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#32CD32]/20 blur-3xl rounded-full animate-pulse" />
        </div>

        {/* Heading */}
        <div className="relative z-10 text-center mb-12 sm:mb-16 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Ready to Begin Your Study Abroad Journey?
          </h2>
          <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Book a{" "}
            <span className="text-[#7BA4FF] font-semibold">
              free counseling session
            </span>{" "}
            with our expert advisors.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-6 rounded-full" />
        </div>

        {/* Form Card */}
        <form
          autoComplete="off"
          onSubmit={handleOnSubmit}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <input type="text" autoComplete="username" hidden />
          <input type="password" autoComplete="new-password" hidden />

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl">
            <div className="space-y-5 sm:space-y-6">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-dark w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/30 outline-none transition text-base"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="input-dark w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/30 outline-none transition text-base"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-dark w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition text-base"
                />
              </div>

              {/* Country */}
              <div className="relative">
                <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                <input
                  name="country"
                  type="text"
                  placeholder="Preferred Country (USA, UK, Canada...)"
                  value={form.country}
                  onChange={handleChange}
                  className="input-dark w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!authChecked}
                className={`w-full py-5 rounded-xl bg-gradient-to-r from-[#4169E1] to-[#32CD32] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-300 active:scale-95 ${
                  !authChecked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-2xl hover:scale-[1.02]"
                }`}
              >
                <Send className="w-6 h-6" />
                {isLoggedIn ? "Book Free Counseling Call" : "Login to Continue"}
              </button>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/7329822309"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 rounded-xl bg-[#25D366] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-400 text-sm sm:text-base px-4">
            No charges • No spam • 100% confidential consultation
          </p>
        </form>
      </section>
    </>
  );
}
