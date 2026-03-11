"use client";

import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for discovering your study abroad options",
    features: [
      "Quick assessment quiz",
      "Browse global universities",
      "Create & manage shortlist",
      "View key application deadlines",
      "Explore scholarships database",
      "Basic profile dashboard",
    ],
    button: "Get Started Free",
    highlight: false,
    tier: "free",
  },
  {
    name: "Student Pro",
    price: "₹499",
    period: "/month",
    description: "AI-powered tools to build a strong application",
    features: [
      "Personalized AI university matches",
      "Smart scholarship matcher",
      "Automatic deadline reminders",
      "Profile strength analysis",
      "Application readiness score",
      "Advanced analytics dashboard",
      "Priority email & chat support",
    ],
    button: "Start Pro Plan",
    highlight: true,
    popular: true,
    tier: "pro",
  },
  {
    name: "Launch",
    price: "₹2,999",
    description: "Hands-on help with your first applications",
    features: [
      "Application preparation checklist",
      "Document guidance & review",
      "Application form filling support",
      "Application tracking dashboard",
      "Email support (48h response)",
      "Support for up to 3 universities",
    ],
    button: "Choose Launch",
    tier: "premium",
  },
  {
    name: "Advance",
    price: "₹7,999",
    description: "Stronger applications with expert feedback",
    features: [
      "Everything in Launch",
      "Detailed SOP review & editing",
      "Resume / CV enhancement",
      "Optimized university shortlisting",
      "Scholarship essay guidance",
      "2 × 45-min counselor sessions",
      "Support for up to 5 universities",
    ],
    button: "Choose Advance",
    tier: "premium",
  },
  {
    name: "Success",
    price: "₹14,999",
    description: "Premium support for top-tier universities",
    features: [
      "Dedicated personal counselor",
      "In-depth SOP strategy & editing",
      "Mock interviews + feedback",
      "Strategic university positioning",
      "Unlimited 1:1 consultations",
      "End-to-end application management",
      "Support for up to 10 universities",
    ],
    button: "Choose Success",
    mostPremium: true,
    tier: "premium",
  },
  {
    name: "Global",
    price: "₹24,999",
    description: "Full journey — from admit to arrival",
    features: [
      "Complete visa documentation support",
      "Visa application filing assistance",
      "Financial proof & bank statement guidance",
      "Visa interview coaching",
      "Pre-departure orientation",
      "Student accommodation shortlisting",
      "Flight & travel planning support",
    ],
    button: "Get Full Support",
    tier: "visa",
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b  from-[#0B1120] to-[#0a0f1a] text-white pb-24 pt-24 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/60 px-4 py-1.5 text-sm font-medium text-blue-300 mb-6">
            <Sparkles size={16} />
            Study Abroad Made Smarter
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Choose Your Path to Study Abroad
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Start for free. Upgrade when you're ready to apply. From discovery
            to visa — we've got the right plan for every stage.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {plans.map((plan) => {
            const isPopular = plan.popular === true;
            const isMostPremium = plan.mostPremium === true;

            let cardClasses =
              "group relative rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 flex flex-col";

            if (isPopular) {
              cardClasses +=
                " border-blue-600/70 bg-gradient-to-b from-blue-950/50 via-[#0f172a] to-[#0B1120] shadow-xl shadow-blue-900/20";
            } else if (isMostPremium) {
              cardClasses +=
                " border-purple-600/60 bg-gradient-to-b from-purple-950/40 via-[#0f172a] to-[#0B1120] shadow-xl shadow-purple-900/20";
            } else {
              cardClasses +=
                " border-gray-800/70 bg-[#111827]/80 backdrop-blur-sm";
            }

            let badgeClasses =
              "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg";

            if (isPopular) {
              badgeClasses += " bg-blue-600 text-white";
            } else if (isMostPremium) {
              badgeClasses += " bg-purple-600 text-white";
            }

            let buttonClasses =
              "mt-auto w-full py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md";

            if (isPopular) {
              buttonClasses +=
                " bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-blue-700/30";
            } else if (isMostPremium) {
              buttonClasses +=
                " bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white shadow-purple-700/30";
            } else if (plan.tier === "free") {
              buttonClasses +=
                " bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-500/40";
            } else {
              buttonClasses +=
                " bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100";
            }

            return (
              <div key={plan.name} className={cardClasses}>
                {/* Popular / Premium Badge */}
                {(isPopular || isMostPremium) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={badgeClasses}>
                      {isPopular ? "Most Popular" : "Best Results"}
                    </span>
                  </div>
                )}

                <div className="p-7 pb-9 flex flex-col flex-1">
                  {/* Name & Price */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight mb-1.5">
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xl text-gray-400 font-medium">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-8 min-h-[3rem]">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-gray-200"
                      >
                        <div className="mt-1">
                          <Check size={18} className="text-emerald-400" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button className={buttonClasses}>{plan.button}</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-gray-500 text-sm sm:text-base max-w-3xl mx-auto">
          <p>
            All application fees are paid directly to universities. Our plans
            include expert guidance, document support, editing, counseling and
            tracking — not university fees.
          </p>
          <p className="mt-3">
            Plans are one-time fees except <strong>Student Pro</strong> (monthly
            recurring).
          </p>
        </div>
      </div>
    </div>
  );
}
