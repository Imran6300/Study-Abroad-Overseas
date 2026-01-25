import { useEffect } from "react";

export default function Step1({
  data,
  updateForm,
  nextStep,
  isLoggedIn,
  user,
  authChecked,
}) {
  // ✅ Prefill from session (safe, non-overwriting)
  useEffect(() => {
    if (!authChecked || !isLoggedIn || !user) return;

    const prefillData = {};

    if (!data.name && user.name) prefillData.name = user.name;
    if (!data.email && user.email) prefillData.email = user.email;
    if (!data.phone && user.phone) prefillData.phone = user.phone;

    if (Object.keys(prefillData).length > 0) {
      updateForm(prefillData);
    }
  }, [authChecked, isLoggedIn, user]);

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
