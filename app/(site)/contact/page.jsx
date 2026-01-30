"use client";

import { motion } from "framer-motion";
import ContactForm from "../../../components/contact/ContactForm";
import ContactInfo from "../../../components/contact/ContactInfo";
import ContactHeader from "../../../components/contact/ContactHeader";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white px-5 sm:px-6 py-20 md:py-20 lg:py-24">
      {/* Main content – form + info */}
      <ContactHeader />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
        {/* Left - Contact Info */}
        <ContactInfo />
        {/* Right - Form */}
        <ContactForm />
      </div>
    </section>
  );
}
