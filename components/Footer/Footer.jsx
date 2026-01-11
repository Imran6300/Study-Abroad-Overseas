"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        bg-gradient-to-b from-[#f8faff] to-[#e6efff]
        text-gray-800 
        pt-16 pb-10 px-5 sm:px-8
        relative overflow-hidden
      "
    >
      {/* Subtle background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative z-10">
        {/* Brand + Description */}
        <div className="space-y-5">
          <h2 className="text-3xl md:text-3.5xl font-extrabold tracking-tight">
            <span className="text-[#4169E1]">Khizar</span>
            <span className="text-[#2ca850]">Overseas</span>
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-sm">
            Expert guidance for studying at top global universities — profile
            building, scholarships, visa & end-to-end support.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 pt-2">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-2.5 bg-white/70 border border-white/90 
                  hover:bg-white hover:shadow-md hover:scale-105 
                  transition-all duration-300 rounded-lg
                "
                aria-label={`Visit our ${Icon.name}`}
              >
                <Icon size={20} className="text-[#4169E1]" strokeWidth={2.2} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-[#4169E1] mb-5">Quick Links</h3>
          <ul className="space-y-3 text-gray-700">
            {[
              "Countries",
              "Top Programs",
              "Services",
              "Success Stories",
              "Scholarships",
              "Study Abroad Process",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#2ca850] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-bold text-[#4169E1] mb-5">
            Our Services
          </h3>
          <ul className="space-y-3 text-gray-700">
            {[
              "Profile Evaluation",
              "University Shortlisting",
              "SOP & LOR Assistance",
              "Visa Filing",
              "Financial Planning",
              "Pre-Departure Support",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#2ca850] transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Subscribe */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#4169E1] mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <Phone className="text-[#2ca850]" size={20} />
                <span>
                  • +91 73299 22309 <br />• +91 90321 76741
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="text-[#4169E1]" size={20} />
                <a
                  href="mailto:info@khizaroverseas.com"
                  className="hover:text-[#2ca850] transition-colors"
                >
                  info@khizaroverseas.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="text-[#4169E1] mt-1" size={20} />
                <div>
                  <div>Hyderabad, Telangana, India</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Global Offices: UK • Canada • USA
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Stay Updated</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="
                  flex-1 bg-white border border-gray-300 
                  px-4 py-3 rounded-l-xl text-gray-800 
                  focus:outline-none focus:border-[#4169E1]/70
                  placeholder:text-gray-400
                "
                required
              />
              <button
                type="submit"
                className="
                  bg-gradient-to-r from-[#4169E1] to-[#2ca850]
                  px-5 py-3 rounded-r-xl text-white
                  hover:brightness-105 active:scale-98
                  transition-all flex items-center
                "
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="mt-12 pt-10 border-t border-[#4169E1]/15">
        <div className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Khizar Overseas — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
