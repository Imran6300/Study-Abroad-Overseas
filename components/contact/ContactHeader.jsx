"use client";
import { motion } from "framer-motion";

import { Users, Award, Globe, Quote } from "lucide-react";

import { useEffect, useState } from "react";

const ContactHeader = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonials`,
        );
        const data = await res.json();

        if (data.success) {
          setStudents(data.data.slice(0, 2)); // 👈 only 2 students
        }
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      }
    };

    fetchStudents();
  }, []);
  return (
    <>
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
            Universities Our Students Joined
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 px-4">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/330px-Harvard_University_coat_of_arms.svg.png",
              "https://res.cloudinary.com/dbezaz49g/image/upload/v1771085407/overseas/universities/iww00p2tlkmubb5oflnt.png",
              "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png",
              "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/330px-NUS_coat_of_arms.svg.png",
            ].map((logo) => (
              <img
                key={logo}
                src={`${logo}`}
                alt={logo.split(".")[0].replace("-", " ")}
                className="h-10 sm:h-12 md:h-14 opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain"
              />
            ))}
          </div>
        </div>

        {/* Testimonials – 1 col mobile, 2 col md+ */}
        <div className="mt-12 md:mt-16">
          <h3 className="text-center font-semibold text-xl sm:text-2xl mb-6 md:mb-8">
            What Our Students Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {students.map((t) => (
              <div
                key={t._id}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-lg"
              >
                <Quote className="text-[#32CD32] mb-3" size={28} />

                <p className="text-gray-200 mb-5 leading-relaxed">
                  "{t.excerpt}"
                </p>

                <div className="flex items-center">
                  <img
                    src={t.photo?.url || "/students/default.jpg"}
                    alt={t.studentName}
                    className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-[#32CD32]/30"
                  />

                  <div>
                    <h4 className="font-semibold">{t.studentName}</h4>

                    <p className="text-gray-400 text-sm">
                      {t.course} • {t.university}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactHeader;
