"use client";

import { useState } from "react";
import { Phone, Mail, User, Globe2, Send, MessageCircle } from "lucide-react";

export default function FinalCTASection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });

  const HandleOnSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Submitted Successfully");
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
      <div className="absolute -top-20 right-10 w-96 h-96 bg-[#4169E1]/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#32CD32]/20 blur-[120px] rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white animate-fade-in">
          Ready to Begin Your Study Abroad Journey?
        </h2>

        <p className="text-gray-300 mt-4 text-lg leading-relaxed animate-fade-in delay-200">
          Book a{" "}
          <span className="text-[#7BA4FF] font-semibold">
            free counseling session{" "}
          </span>
          with our expert advisors. Get guidance on scholarships, universities,
          visas, and financial planning.
        </p>

        <div
          className="
          w-32 h-[4px] bg-gradient-to-r from-[#4169E1] to-[#32CD32]
          mx-auto mt-6 rounded-full animate-fade-in delay-300
        "
        />
      </div>

      {/* Consultation Form */}

      <form
        autoComplete="off" // keep this on form
        action="/homeform"
        method="post"
        onSubmit={HandleOnSubmit}
      >
        {/* These two hidden fields trick Chrome into thinking it already "filled" username/password-like data */}
        <input
          type="text"
          autoComplete="username"
          style={{ display: "none" }}
          tabIndex={-1}
          aria-hidden="true"
        />
        <input
          type="password"
          autoComplete="new-password"
          style={{ display: "none" }}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-xl animate-slide-up">
          <div className="grid grid-cols-1 gap-6">
            {/* NAME */}
            <div className="relative">
              <User className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="nope" // ← key change
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl outline-none border border-white/20 focus:border-[#4169E1] transition"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                autoComplete="nope" // ← key change
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl outline-none border border-white/20 focus:border-[#4169E1] transition"
              />
            </div>

            {/* PHONE */}
            <div className="relative">
              <Phone className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="phone"
                type="tel"
                required
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                value={form.phone}
                onChange={handleChange}
                autoComplete="nope" // ← key change
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl outline-none border border-white/20 focus:border-[#32CD32] transition"
              />
            </div>

            {/* COUNTRY – can also get suggestions sometimes */}
            <div className="relative">
              <Globe2 className="absolute left-4 top-3 text-gray-300 h-5 w-5" />
              <input
                name="country"
                type="text"
                placeholder="Preferred Country (USA, UK, Canada...)"
                onChange={handleChange}
                value={form.country}
                autoComplete="nope" // ← optional but good
                className="w-full bg-white/5 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-xl outline-none border border-white/20 focus:border-[#32CD32] transition"
              />
            </div>
            {/* CTA BUTTON */}
            <button
              type="submit"
              className="
              w-full py-4 text-lg font-semibold text-white rounded-xl
              bg-gradient-to-r from-[#4169E1] to-[#32CD32]
              shadow-[0_10px_40px_rgba(65,105,225,0.35)]
              hover:scale-[1.03] transition-all hover:shadow-[0_15px_50px_rgba(65,105,225,0.5)]
              flex items-center justify-center gap-2
            "
            >
              <Send size={20} />
              Book Free Counseling Call
            </button>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              onClick={() => alert("This Feature Is Comming Soon")}
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

      {/* Footer Message */}
      <p className="text-center mt-10 text-gray-400 text-sm animate-fade-in">
        No charges • No spam • 100% confidential consultation
      </p>
    </section>
  );
}
