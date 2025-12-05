"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        bg-gradient-to-b from-[#F4F7FF] to-[#DCE6FF]
        text-[#1A2433] 
        pt-20 pb-10 px-6 
        relative overflow-hidden
      "
    >
      {/* Soft Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#4169E1]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#32CD32]/10 blur-3xl"></div>

      {/* Footer Grid */}
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold mb-4">
            <span className="text-[#4169E1]">Khizar</span>{" "}
            <span className="text-[#32CD32]">Overseas</span>
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Empowering students to study in top global universities with expert
            guidance, scholarships, and end-to-end support.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-6">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <div
                key={i}
                className="
                  p-3 bg-white/60 border border-white/80 
                  hover:shadow-md transition rounded-xl cursor-pointer
                "
              >
                <Icon size={20} className="text-[#4169E1]" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#4169E1]">Quick Links</h3>
          <ul className="space-y-3 text-[#1A2433]">
            {[
              "Countries",
              "Top Programs",
              "Services",
              "Success Stories",
              "Scholarships",
              "Study Abroad Process",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#32CD32] transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#4169E1]">
            Our Services
          </h3>
          <ul className="space-y-3 text-[#1A2433]">
            {[
              "Profile Evaluation",
              "University Shortlisting",
              "SOP/LOR Assistance",
              "Visa Filing",
              "Financial Planning",
              "Pre-Departure Support",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-[#32CD32] transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#4169E1]">Contact Us</h3>

          <ul className="space-y-4 text-[#1A2433]">
            <li className="flex items-center gap-3">
              <Phone className="text-[#32CD32]" size={20} />
              +91 7329922309 / 9032176741
            </li>

            <li className="flex items-center gap-3">
              <Mail className="text-[#4169E1]" size={20} />
              info@studyabroad.com
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="text-[#4169E1]" size={20} />
              <span>
                Hyderabad, India <br /> Global Offices: UK • Canada • USA
              </span>
            </li>
          </ul>

          {/* Subscribe */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-[#1A2433]">
              Subscribe for Updates
            </h4>

            <div className="flex items-center bg-white rounded-xl overflow-hidden border border-[#4169E1]/20 shadow-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-[#1A2433] px-4 py-3 outline-none placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-[#4169E1] to-[#32CD32] px-4 py-3 flex items-center justify-center hover:opacity-90 transition">
                <ArrowRight size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#4169E1]/20 my-10"></div>

      {/* Copyright */}
      <div className="text-center text-[#1A2433] text-sm relative z-10 font-medium">
        © {new Date().getFullYear()} Khizar Overseas — All Rights Reserved.
      </div>
    </footer>
  );
}
