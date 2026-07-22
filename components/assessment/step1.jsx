"use client";

import { useState } from "react";
import { validatePhone } from "@/lib/phoneValidation";

export default function Step1({ data, updateForm, nextStep }) {
  const [phoneError, setPhoneError] = useState(null);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneCheck = validatePhone(data.phone);

  const isValid =
    data.name.trim() !== "" &&
    data.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    phoneCheck.valid;

  const handlePhoneChange = (e) => {
    updateForm({ phone: e.target.value });
    // Only surface errors once the person has already left the field once
    // (or is correcting a previously-flagged number) — avoids flashing
    // "invalid" while they're still mid-way through typing.
    if (phoneTouched) {
      setPhoneError(validatePhone(e.target.value).error);
    }
  };

  const handlePhoneBlur = (e) => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(e.target.value).error);
  };

  const handleNext = () => {
    if (!phoneCheck.valid) {
      setPhoneTouched(true);
      setPhoneError(phoneCheck.error || "Phone number is required");
      return;
    }
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

      <div>
        <input
          type="tel"
          placeholder="Phone Number (e.g. +91XXXXXXXXXX)"
          value={data.phone}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          className="input"
        />
        {phoneTouched && phoneError && (
          <p className="text-red-500 text-sm mt-1">{phoneError}</p>
        )}
      </div>

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
