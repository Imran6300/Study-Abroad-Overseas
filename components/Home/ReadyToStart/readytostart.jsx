"use client";

// redux
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// icons
import { Phone, Mail, User, Globe2, Send, MessageCircle } from "lucide-react";

export default function FinalCTASection() {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn, user, authChecked } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  // ✅ Autofill form when logged in
  useEffect(() => {
    if (authChecked && isLoggedIn && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }

    // Optional: clear form on logout
    if (authChecked && !isLoggedIn) {
      setForm({
        name: "",
        email: "",
        phone: "",
        country: "",
      });
    }
  }, [authChecked, isLoggedIn, user]);

  // ✅ Submit handler with auth gate
  const HandleOnSubmit = (e) => {
    e.preventDefault();

    // Still checking auth — block interaction
    if (!authChecked) return;

    // 🔒 Require login
    if (!isLoggedIn) {
      alert("Please login first to submit the form");

      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    // ✅ Logged-in user
    console.log("Form Data:", form);
    alert("Submitted Successfully");

    // 🔥 Send to backend here
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section
      className="
        w-full py-32 px-6 relative overflow-hidden
        bg-gradient-to-b from-[#0A1124] to-[#0D1428]
      "
    >
      {/* Background Glow Effects */}
      <div className="absolute -top-20 right-10 w-96 h-96 bg-[#4169E1]/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#32CD32]/20 blur-[120px] rounded-full animate-pulse" />

      {/* Heading */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white animate-fade-in">
          Ready to Begin Your Study Abroad Journey?
        </h2>

        <p className="text-gray-300 mt-4 text-lg leading-relaxed animate-fade-in delay-200">
          Book a{" "}
          <span className="text-[#7BA4FF] font-semibold">
            free counseling session
          </span>{" "}
          with our expert advisors.
        </p>

        <div
          className="
            w-32 h-[4px] bg-gradient-to-r from-[#4169E1] to-[#32CD32]
            mx-auto mt-6 rounded-full animate-fade-in delay-300
          "
        />
      </div>

      {/* Consultation Form */}
      <form autoComplete="off" onSubmit={HandleOnSubmit}>
        {/* Chrome autofill blockers */}
        <input type="text" autoComplete="username" hidden />
        <input type="password" autoComplete="new-password" hidden />

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl animate-slide-up">
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl border border-white/20 focus:border-[#4169E1] outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl border border-white/20 focus:border-[#4169E1] outline-none transition"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="phone"
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="off"
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl border border-white/20 focus:border-[#32CD32] outline-none transition"
              />
            </div>

            {/* Country */}
            <div className="relative">
              <Globe2 className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="country"
                type="text"
                placeholder="Preferred Country (USA, UK, Canada...)"
                value={form.country}
                onChange={handleChange}
                autoComplete="off"
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl border border-white/20 focus:border-[#32CD32] outline-none transition"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={!authChecked}
              className={`
                w-full py-4 text-lg font-semibold text-white rounded-xl
                bg-gradient-to-r from-[#4169E1] to-[#32CD32]
                shadow-[0_10px_40px_rgba(65,105,225,0.35)]
                flex items-center justify-center gap-2 transition-all
                ${
                  !authChecked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.03] hover:shadow-[0_15px_50px_rgba(65,105,225,0.5)]"
                }
              `}
            >
              <Send size={20} />
              {isLoggedIn ? "Book Free Counseling Call" : "Login to Continue"}
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              onClick={() => alert("This feature is coming soon")}
              target="_blank"
              className="
                w-full py-4 text-lg font-semibold text-white rounded-xl
                bg-[#25D366] shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                hover:scale-[1.03] transition-all flex items-center justify-center gap-2
              "
            >
              <MessageCircle size={22} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </form>

      <p className="text-center mt-10 text-gray-400 text-sm">
        No charges • No spam • 100% confidential consultation
      </p>
    </section>
  );
}
