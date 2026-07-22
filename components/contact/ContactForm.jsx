"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { validatePhone } from "@/lib/phoneValidation";

const ContactForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, authChecked } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = Boolean(user);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    courseLevel: "",
    intake: "",
    message: "",
  });

  const [phoneError, setPhoneError] = useState(null);
  const [phoneTouched, setPhoneTouched] = useState(false);

  /* ✅ Safe prefill */
  useEffect(() => {
    if (!authChecked || !isLoggedIn || !user) return;

    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }));
  }, [authChecked, isLoggedIn, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    handleChange(e);
    if (phoneTouched) {
      setPhoneError(validatePhone(e.target.value).error);
    }
  };

  const handlePhoneBlur = (e) => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(e.target.value).error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authChecked || loading) return;

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Validate phone (and force a country code) before hitting the API —
    // same check the field does on blur, repeated here so submitting via
    // Enter can't skip it.
    const phoneCheck = validatePhone(form.phone);
    if (!phoneCheck.valid) {
      setPhoneTouched(true);
      setPhoneError(phoneCheck.error || "Phone number is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contactform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Request submitted successfully!");
    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-white/6 backdrop-blur-xl rounded-2xl p-5 xs:p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl order-1 lg:order-2"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center md:text-left">
        Start Your Journey Today
      </h2>

      <div className="space-y-5 sm:space-y-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-5">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name *"
            required
            className="input"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address *"
            required
            className="input"
          />
        </div>

        {/* Phone + Destination */}
        <div className="grid grid-cols-1 gap-5">
          <div>
            <input
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              type="tel"
              placeholder="Phone Number (e.g. +91XXXXXXXXXX) *"
              required
              className="input"
            />
            {phoneTouched && phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <select
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="input"
          >
            <option value="">Preferred Study Destination</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>Other</option>
          </select>
        </div>

        {/* Course Level + Intake */}
        <div className="grid grid-cols-1 gap-5">
          <select
            name="courseLevel"
            value={form.courseLevel}
            onChange={handleChange}
            className="input"
          >
            <option value="">Course Level</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>MBA</option>
            <option>PhD</option>
            <option>Diploma / Foundation</option>
          </select>

          <select
            name="intake"
            value={form.intake}
            onChange={handleChange}
            className="input"
          >
            <option value="">Preferred Intake</option>
            <option>Spring 2026</option>
            <option>Fall 2026</option>
            <option>Other</option>
          </select>
        </div>

        {/* Message */}
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Your study goals or questions..."
          className="input resize-y min-h-[140px]"
        />

        {/* Submit */}
        {!authChecked ? (
          <button disabled className="btn-primary w-full opacity-60">
            Checking authentication...
          </button>
        ) : !isLoggedIn ? (
          <button type="submit" className="btn-primary w-full">
            Login / Signup to Continue 🔐
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Submitting..." : "Request Free Consultation →"}
          </button>
        )}

        <p className="text-center text-gray-500 text-xs mt-4">
          <CheckCircle size={14} className="inline mr-1.5" />
          Free • No spam • Secure submission
        </p>
      </div>
    </motion.form>
  );
};

export default ContactForm;
