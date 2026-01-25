import {
  CheckCircle, // CheckCircle2
} from "lucide-react";

const ContactForm = () => {
  return (
    <>
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
    </>
  );
};

export default ContactForm;
