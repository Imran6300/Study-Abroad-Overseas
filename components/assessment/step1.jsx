"use client";

export default function Step1({ data, updateForm, nextStep }) {
  const isValid =
    data.name.trim() !== "" &&
    data.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.trim() !== "";

  const handleNext = () => {
    if (!isValid) return;
    nextStep();
  };

  return (
    <div className="space-y-5">
      <input
        type="text"
        placeholder="Full Name"
        value={data.name}
        onChange={(e) => updateForm({ name: e.target.value })}
        className="input"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={data.email}
        onChange={(e) => updateForm({ email: e.target.value })}
        className="input"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={data.phone}
        onChange={(e) => updateForm({ phone: e.target.value })}
        className="input"
      />

      <button
        onClick={handleNext}
        disabled={!isValid}
        className="btn-primary w-full disabled:opacity-60"
      >
        Continue →
      </button>
    </div>
  );
}
