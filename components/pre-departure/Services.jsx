const services = [
  {
    title: "Travel & Packing Guidance",
    desc: "Country-specific packing checklist, baggage rules, medicines & documents.",
  },
  {
    title: "Accommodation Support",
    desc: "University dorms, private housing, temporary stay & safety tips.",
  },
  {
    title: "Airport & Immigration Briefing",
    desc: "Immigration Q&A, document preparation, transit guidance.",
  },
  {
    title: "Country Orientation",
    desc: "Culture, lifestyle, local laws, student do’s & don’ts.",
  },
  {
    title: "Finance & Banking Setup",
    desc: "Forex cards, banking, emergency funds & cost-saving tips.",
  },
  {
    title: "Health, Insurance & Safety",
    desc: "Insurance setup, emergency contacts & mental health awareness.",
  },
];

export default function Services() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center">
        What We Help You With
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item, i) => (
          <div
            key={i}
            className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800 hover:border-[#4169E1] transition"
          >
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
