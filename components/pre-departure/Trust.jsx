export default function Trust() {
  return (
    <section className="py-20 px-6 bg-[#0f172a] text-center">
      <h2 className="text-3xl font-bold text-white">
        Trusted by Students & Parents
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
        {[
          "1000+ Successful Departures",
          "Country-Wise Expert Counselors",
          "Dedicated Post-Arrival Support",
        ].map((item) => (
          <div
            key={item}
            className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6"
          >
            <p className="text-lg font-semibold text-[#32CD32]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
