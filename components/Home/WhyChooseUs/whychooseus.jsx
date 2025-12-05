"use client";

import { CheckCircle } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section
      className="
        w-full 
        py-20 px-6 
        flex flex-col items-center
        
        bg-gradient-to-b 
        from-[#0E1A2B] 
        via-[#132036] 
        to-[#0E1A2B]
        text-white
      "
    >
      {/* Heading */}
      <div className="text-center mb-14 max-w-2xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
          Why Choose Us
        </h2>

        <p className="text-gray-300 mt-3 text-base md:text-lg">
          We simplify your study-abroad journey with expert guidance, global
          partnerships, and personalized support.
        </p>

        <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#4169E1] to-[#32CD32] mx-auto mt-4" />
      </div>

      {/* ======================= */}
      {/* STATISTICS ROW */}
      {/* ======================= */}
      <div
        className="
          grid grid-cols-2 md:grid-cols-4 gap-8 
          mb-16 w-full max-w-[1100px]
        "
      >
        {[
          { value: "10+", label: "Years Experience" },
          { value: "5000+", label: "Students Placed" },
          { value: "98%", label: "Visa Success Rate" },
          { value: "200+", label: "Partner Universities" },
        ].map((stat, i) => (
          <div
            key={i}
            className="
              text-center bg-white/10 backdrop-blur-md
              py-6 rounded-xl shadow-md border border-white/10
            "
          >
            <h3 className="text-3xl font-extrabold text-[#32CD32]">
              {stat.value}
            </h3>
            <p className="text-gray-300 text-sm md:text-base mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ======================= */}
      {/* BADGES */}
      {/* ======================= */}
      <div className="flex flex-wrap justify-center gap-6 mb-20">
        {[
          { text: "Award-Winning Consultancy", color: "#4169E1" },
          { text: "Trusted by Top Universities", color: "#32CD32" },
          { text: "5-Star Student Reviews", color: "#4169E1" },
        ].map((badge, i) => (
          <div
            key={i}
            className="
              px-6 py-3 rounded-full 
              text-sm font-semibold shadow-md
              bg-white/10 backdrop-blur-md border border-white/10
            "
            style={{ color: badge.color }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* ======================= */}
      {/* FLOATING FEATURE CARDS */}
      {/* ======================= */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
          gap-10 max-w-[1200px] w-full
        "
      >
        {[
          {
            title: "Expert Counseling",
            desc: "Certified counselors with deep experience in global admissions.",
          },
          {
            title: "University Shortlisting",
            desc: "We match your profile with top global universities.",
          },
          {
            title: "Visa & Application Support",
            desc: "From SOP writing to visa filing, we assist step-by-step.",
          },
          {
            title: "Scholarships Assistance",
            desc: "Get guidance on top scholarships and funding opportunities.",
          },
          {
            title: "24/7 Student Support",
            desc: "We stay connected with you even after you reach abroad.",
          },
          {
            title: "Tailored Roadmaps",
            desc: "Get personalized plans designed for your goals.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="
              bg-white rounded-2xl p-8 text-center shadow-xl
              transition-all duration-300
              hover:-translate-y-3 hover:shadow-2xl
            "
          >
            <div className="flex justify-center mb-4">
              <div
                className="
                  w-14 h-14 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-[#4169E1] to-[#32CD32] text-white
                  shadow-lg
                "
              >
                <CheckCircle size={30} />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[#2F4F4F] mb-2">
              {item.title}
            </h3>

            <p className="text-gray-600 text-sm leading-6">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
