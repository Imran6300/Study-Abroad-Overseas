"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Globe,
  Calendar,
  Pencil,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoggedIn, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  /* ───────── AUTH GUARD ───────── */
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [loading, isLoggedIn, router]);

  /* ───────── INIT FORM DATA ───────── */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        qualification: user.qualification || "",
        field: user.fieldOfStudy || "",
        graduationYear: user.graduationYear || "",
        gpa: user.gpa || "",
        preferredCountry: user.preferredCountry || "",
        intendedIntake: user.intendedIntake || "",
      });
    }
  }, [user]);

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1C2D] text-white">
        Loading profile...
      </div>
    );
  }

  /* ───────── HANDLERS ───────── */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsEditing(false);

    console.log("Saving profile:", formData);
    // TODO: API call → PATCH /api/profile
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] to-[#0f2440] pt-28 px-6 pb-16 text-white">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
          👤
        </div>
        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="text-gray-400">
            Keep your details updated for better recommendations
          </p>
        </div>
      </motion.div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/8 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* BASIC INFO */}
        <Section title="Basic Information" icon={User}>
          <Field
            label="Full Name"
            name="name"
            value={formData.name}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Email"
            name="email"
            value={formData.email}
            editing={false}
          />
        </Section>

        {/* ACADEMIC */}
        <Section title="Academic Details" icon={GraduationCap}>
          <Field
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Field of Study"
            name="field"
            value={formData.field}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Graduation Year"
            name="graduationYear"
            value={formData.graduationYear}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="GPA / Percentage"
            name="gpa"
            value={formData.gpa}
            editing={isEditing}
            onChange={handleChange}
          />
        </Section>

        {/* PREFERENCES */}
        <Section title="Study Preferences" icon={Globe}>
          <Field
            label="Preferred Country"
            name="preferredCountry"
            value={formData.preferredCountry}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Intended Intake"
            name="intendedIntake"
            value={formData.intendedIntake}
            editing={isEditing}
            onChange={handleChange}
          />
        </Section>

        {/* ACTIONS */}
        <div className="p-6 flex justify-end gap-4 border-t border-white/10 bg-black/20">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/10 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20"
            >
              <Pencil size={18} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-[#32CD32] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
            >
              <Save size={18} /> Save Changes
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ───────── COMPONENTS ───────── */

function Section({ title, icon: Icon, children }) {
  return (
    <section className="p-6 border-b border-white/10">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#32CD32]">
        <Icon size={20} /> {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

function Field({ label, name, value, editing, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none"
        />
      ) : (
        <div className="bg-white/6 rounded-xl px-4 py-3 border border-white/5">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
}
