"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Award,
  Quote,
  MessageCircleMore,
  CheckCircle,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white px-5 sm:px-6 py-20 md:py-20 lg:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center mb-14 md:mb-16"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-5">
          Get in <span className="text-[#32CD32]">Touch</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Questions about studying abroad? Our expert team is ready to assist
          you every step of the way.
        </p>
      </motion.div>

      {/* Trust signals – stacked on mobile, 3-col on md+ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto mb-16 md:mb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <Users className="text-[#32CD32] mb-3" size={36} />
            <h3 className="font-semibold text-xl mb-1">5000+ Students</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Successfully placed in top global universities
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <Award className="text-[#32CD32] mb-3" size={36} />
            <h3 className="font-semibold text-xl mb-1">98% Visa Success</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Proven track record year after year
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 sm:col-span-2 lg:col-span-1">
            <Globe className="text-[#32CD32] mb-3" size={36} />
            <h3 className="font-semibold text-xl mb-1">Since 2010</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              15+ years guiding international careers
            </p>
          </div>
        </div>

        {/* Partner logos – scrollable on mobile if many */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-center font-semibold text-xl sm:text-2xl mb-6 md:mb-8">
            Trusted Partners & Associations
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 px-4">
            {["british-council.png", "icef.png", "aaeri.png", "idp.png"].map(
              (logo) => (
                <img
                  key={logo}
                  src={`/partners/${logo}`}
                  alt={logo.split(".")[0].replace("-", " ")}
                  className="h-10 sm:h-12 md:h-14 opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              ),
            )}
          </div>
        </div>

        {/* Testimonials – 1 col mobile, 2 col md+ */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-center font-semibold text-xl sm:text-2xl mb-6 md:mb-8">
            What Our Students Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                text: "Overseas Guide turned my dream of studying in the USA into reality. Exceptional support throughout!",
                name: "Rahul K.",
                course: "MS Computer Science",
                uni: "University of California",
                img: "/students/rahul.jpg",
              },
              {
                text: "Smooth visa process and secured a full scholarship. Cannot recommend them enough!",
                name: "Priya S.",
                course: "MBA",
                uni: "University of Toronto",
                img: "/students/priya.jpg",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg"
              >
                <Quote className="text-[#32CD32] mb-3" size={28} />
                <p className="text-gray-200 mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-[#32CD32]/30"
                  />
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {t.course} • {t.uni}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main content – form + info */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
        {/* Left - Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-7 md:space-y-9 order-2 lg:order-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                Icon: Mail,
                title: "Email Us",
                value: "support@overseasguide.com",
              },
              {
                Icon: Phone,
                title: "Call Us (India)",
                value: "+91 98765 43210",
              },
              {
                Icon: MessageCircleMore,
                title: "WhatsApp",
                value: "+91 98765 43211",
              },
              { Icon: Phone, title: "USA Support", value: "+1 (800) 123-4567" },
            ].map(({ Icon, title, value }, i) => (
              <div key={i} className="flex items-start gap-4">
                <Icon className="text-[#32CD32] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-medium text-base sm:text-lg">{title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-[#32CD32] mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-medium text-base sm:text-lg">Our Office</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Plot No. 123, Road No. 10
                <br />
                Banjara Hills, Hyderabad
                <br />
                Telangana 500034, India
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-3">
                CIN: U80902TG2010PTC123456 • GST: 36ABCDE1234F1Z5
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.789123456789!2d78.45678901234567!3d17.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99d123456789%3A0xabcde1234567890f!2sBanjara%20Hills%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.4] hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <div className="pt-4 text-gray-400 text-sm leading-relaxed">
            Expert guidance for admissions, scholarships, visas & more — 100%
            free consultation.
          </div>

          {/* Lead Counselor */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <h3 className="font-medium text-lg mb-4">
              Meet Your Lead Counselor
            </h3>
            <div className="flex items-center gap-4">
              <img
                src="/team/lead-counselor.jpg"
                alt="Dr. Anita Rao"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#32CD32]/40"
              />
              <div>
                <h4 className="font-semibold">Dr. Anita Rao</h4>
                <p className="text-gray-400 text-sm">
                  10+ years • Certified ICEF Agent
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        {/* Right - Form */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/6 backdrop-blur-xl rounded-2xl p-5 xs:p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl order-1 lg:order-2"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 md:mb-8 text-center md:text-left">
            Start Your Journey Today
          </h2>

          <div className="space-y-5 sm:space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-5 xs:gap-6">
              <input
                type="text"
                placeholder="Full Name *"
                required
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition-all placeholder:text-gray-500 text-white min-h-[52px]"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition-all placeholder:text-gray-500 text-white min-h-[52px]"
              />
            </div>

            {/* Phone + Destination */}
            <div className="grid grid-cols-1 gap-5 xs:gap-6">
              <input
                type="tel"
                placeholder="Phone Number (with country code) *"
                required
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition-all placeholder:text-gray-500 text-white min-h-[52px]"
              />
              <select
                defaultValue=""
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none text-gray-300 min-h-[52px]"
              >
                <option value="" disabled>
                  Preferred Study Destination
                </option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>Ireland</option>
                <option>Other</option>
              </select>
            </div>

            {/* Course Level + Intake */}
            <div className="grid grid-cols-1 gap-5 xs:gap-6">
              <select
                defaultValue=""
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none text-gray-300 min-h-[52px]"
              >
                <option value="" disabled>
                  Course Level
                </option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
                <option>MBA</option>
                <option>PhD</option>
                <option>Diploma / Foundation</option>
              </select>

              <select
                defaultValue=""
                className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none text-gray-300 min-h-[52px]"
              >
                <option value="" disabled>
                  Preferred Intake
                </option>
                <option>Spring 2026</option>
                <option>Fall 2026</option>
                <option>Spring 2027</option>
                <option>Fall 2027</option>
                <option>Other</option>
              </select>
            </div>

            {/* Message */}
            <textarea
              rows={5}
              placeholder="Your study goals, questions or any specific requirements..."
              className="w-full px-4 py-3.5 sm:py-4 text-base rounded-lg bg-black/30 border border-white/20 focus:border-[#32CD32] focus:ring-2 focus:ring-[#32CD32]/30 outline-none transition-all placeholder:text-gray-500 text-white resize-y min-h-[140px]"
            />

            {/* Consent */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="consent"
                required
                className="mt-1.5 h-5 w-5 accent-[#32CD32] flex-shrink-0"
              />
              <label
                htmlFor="consent"
                className="text-gray-400 text-sm leading-relaxed"
              >
                I agree to the{" "}
                <a href="/terms" className="text-[#32CD32] hover:underline">
                  Terms
                </a>{" "}
                &{" "}
                <a href="/privacy" className="text-[#32CD32] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 px-6 sm:px-8 rounded-full font-semibold text-base sm:text-lg mt-2
        bg-gradient-to-r from-[#4169E1] via-[#32CD32] to-[#32CD32]
        hover:from-[#32CD32] hover:to-[#4169E1]
        shadow-xl shadow-[#32CD32]/20 hover:shadow-[#32CD32]/40
        transition-all duration-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              Request Free Consultation →
            </button>

            <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
              <CheckCircle size={14} className="inline mr-1.5" />
              Free • No spam • Usually reply within 24 hours
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
