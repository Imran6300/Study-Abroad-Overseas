export default function Step1({ data, updateForm, nextStep }) {
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

      <button onClick={nextStep} className="btn-primary w-full">
        Continue →
      </button>
    </div>
  );
}
