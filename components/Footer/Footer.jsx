"use client";

import Link from "next/link";
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
    <footer className="bg-gradient-to-b from-[#f8faff] to-[#e6efff] text-gray-800 pt-16 pb-10 px-5 sm:px-8 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative z-10">
        {/* Brand */}
        <div className="space-y-5">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight block"
          >
            <span className="text-[#4169E1]">Khizar </span>
            <span className="text-[#2ca850]">Overseas</span>
          </Link>

          <p className="text-gray-600 leading-relaxed max-w-sm">
            Expert guidance for studying at top global universities — profile
            building, scholarships, visa & end-to-end support.
          </p>

          {/* Socials */}
          <div className="flex gap-4 pt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61553895275238&rdid=Peg2Nkx4KdECSUkD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DNf4akFXe%2F#"
              target="_blank"
              aria-label="Facebook"
            >
              <Facebook className="text-[#4169E1]" />
            </a>
            <a href="" target="_blank" aria-label="Instagram">
              <Instagram className="text-[#4169E1]" />
            </a>
            <a href="" target="_blank" aria-label="LinkedIn">
              <Linkedin className="text-[#4169E1]" />
            </a>
            <a href="" target="_blank" aria-label="Twitter">
              <Twitter className="text-[#4169E1]" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-[#4169E1] mb-5">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/all-countries" className="hover:text-[#2ca850]">
                Countries
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-[#2ca850]">
                Top Programs
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-[#2ca850]">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/success-stories" className="hover:text-[#2ca850]">
                Success Stories
              </Link>
            </li>
            <li>
              <Link
                href="/programs/scholarships"
                className="hover:text-[#2ca850]"
              >
                Scholarships
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-bold text-[#4169E1] mb-5">
            Our Services
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                href="/services/profile-evaluation"
                className="hover:text-[#2ca850]"
              >
                Profile Evaluation
              </Link>
            </li>
            <li>
              <Link
                href="/services/university-shortlisting"
                className="hover:text-[#2ca850]"
              >
                University Shortlisting
              </Link>
            </li>
            <li>
              <Link href="/services/sop-lor" className="hover:text-[#2ca850]">
                SOP & LOR Assistance
              </Link>
            </li>
            <li>
              <Link href="/services/visa" className="hover:text-[#2ca850]">
                Visa Guidance & Filing
              </Link>
            </li>
            <li>
              <Link href="/services/finance" className="hover:text-[#2ca850]">
                Financial Planning
              </Link>
            </li>
            <li>
              <Link
                href="/services/pre-departure"
                className="hover:text-[#2ca850]"
              >
                Pre-Departure Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#4169E1]">Contact Us</h3>

          <div className="space-y-4">
            <a
              href="tel:+919032176741"
              className="flex gap-3 hover:text-[#2ca850]"
            >
              <Phone /> +91 7329822309
            </a>
            <a
              href="tel:+917329922309"
              className="flex gap-3 hover:text-[#2ca850]"
            >
              <Phone /> +91 73299 22309
            </a>

            <a
              href="tel:+919032176741"
              className="flex gap-3 hover:text-[#2ca850]"
            >
              <Phone /> +91 90321 76741
            </a>

            <a
              href="mailto:Consultant@gmail.com"
              className="flex gap-3 hover:text-[#2ca850]"
            >
              <Mail /> info@khizaroverseas.com
            </a>

            <div className="flex gap-3">
              <MapPin />
              Hyderabad, Telangana, India
            </div>
          </div>

          {/* Newsletter */}
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border rounded-l-xl"
            />
            <button className="px-5 py-3 bg-gradient-to-r from-[#4169E1] to-[#2ca850] text-white rounded-r-xl">
              <ArrowRight />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-[#4169E1]/15 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Khizar Overseas — All Rights Reserved
      </div>
    </footer>
  );
}
