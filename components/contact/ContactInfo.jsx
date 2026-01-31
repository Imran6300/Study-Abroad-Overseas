import { motion } from "framer-motion";

import {
  Mail,
  Phone,
  MapPin,
  Globe, // Globe2,
  Users, // Users2,
  Award, // Award2,
  Quote, // Quote2,
  MessageCircleMore,
  CheckCircle, // CheckCircle2
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
          Expert guidance for admissions, scholarships, visas & more — 100% free
          consultation.
        </div>

        {/* Lead Counselor */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
          <h3 className="font-medium text-lg mb-4">Meet Your Lead Counselor</h3>
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
    </>
  );
};

export default ContactInfo;
