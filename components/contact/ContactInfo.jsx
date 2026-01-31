import { motion } from "framer-motion";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircleMore,
} from "lucide-react";

const ContactInfo = () => {
  return (
    <>
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
              value: "khizaroverseas@gmail.com",
            },
            {
              Icon: Phone,
              title: "Call Us (India)",
              value: "+91 73298 22309",
            },
            {
              Icon: MessageCircleMore,
              title: "WhatsApp",
              value: "+91 73299 22309",
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
              Shop No.35, 5-4-410
              <br />
              Nampally, Hyderabad
              <br />
              Telangana 500001, India
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-3">
              • GST: 36AAUFK0370M2ZS
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1537.52881545907!2d78.46932613167367!3d17.39009053324498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb998266df7d49%3A0xa1c01242889df869!2sKhizar%20Tours%20and%20Travels!5e0!3m2!1sen!2sin!4v1769850065685!5m2!1sen!2sin"
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
          Expert guidance for admissions, scholarships, visas & more — 100% free
          consultation.
        </div>

        {/* Lead Counselor */}
<div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
  <h3 className="font-medium text-lg mb-4">Meet Your Lead Counselor</h3>
  <div className="flex items-center gap-4 sm:gap-5">
    <div className="shrink-0 w-20 h-24 sm:w-24 sm:h-28 overflow-hidden rounded-lg border-2 border-[#32CD32]/40 bg-gray-800/40">
      <img
        src="/team/javid.png"
        alt="Javid Ahmed Mohammed"
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <h4 className="font-semibold">Mohammed Javid Ahmed</h4>
      <p className="text-gray-400 text-sm">
        10+ years • Certified ABCC Agent
      </p>
    </div>
  </div>
</div>
      </motion.div>
    </>
  );
};

export default ContactInfo;
