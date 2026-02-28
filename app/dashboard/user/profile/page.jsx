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
  const { user, loading } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(user);
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(""); // ← NEW: for showing error message

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError(""); // clear previous error

    if (!file) return;

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image is too large. Maximum allowed size is 5 MB.");
      e.target.value = ""; // reset file input
      return;
    }

    // Optional: you can also check mime type more strictly
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
        dob: user.dob || "",
        gender: user.gender || "",
        nationality: user.nationality || "",
        passportnumber: user.passportnumber || "",
        passportexpiry: user.passportexpiry || "",
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1C2D] to-[#0f2440] pt-28 px-6 pb-16 text-white">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>

          {/* ALWAYS visible pencil */}
          <label className="absolute bottom-0 right-0 bg-[#32CD32] p-2 rounded-full cursor-pointer shadow-lg hover:scale-105 transition">
            <Pencil size={14} className="text-black" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="text-gray-400">
            Keep your details updated for better recommendations
          </p>
        </div>
      </motion.div>

      {/* ERROR MESSAGE under profile picture */}
      {imageError && (
        <p className="text-red-400 text-sm mb-6 text-center max-w-xs mx-auto">
          {imageError}
        </p>
      )}

      {/* Optional: show current file size when valid */}
      {imageFile && !imageError && (
        <p className="text-xs text-gray-400 mb-6 text-center">
          Selected: {(imageFile.size / 1024 / 1024).toFixed(1)} MB
        </p>
      )}

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

        <Section title="Identity Info" icon={Globe}>
          <Field
            label="Date Of Birth"
            name="dob"
            value={formData.dob}
            editing={isEditing}
            onChange={handleChange}
            type="date"
            className="cursor-pointer"
          />
          <Field
            label="Gender"
            name="gender"
            value={formData.gender}
            editing={isEditing}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            className="cursor-pointer"
          />
          <Field
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            editing={isEditing}
            onChange={handleChange}
            options={[
              "India",
              "Pakistan",
              "Bangladesh",
              "Nepal",
              "Sri Lanka",
              "Other",
            ]}
            className="cursor-pointer"
          />
          <Field
            label="Passport Number"
            name="passportnumber"
            value={formData.passportnumber}
            editing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Passport Expiry"
            name="passportexpiry"
            value={formData.passportexpiry}
            editing={isEditing}
            onChange={handleChange}
            type="date"
            className="cursor-pointer"
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

function Field({
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
  options,
  className = "",
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>

      {editing ? (
        options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none ${className}`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-black">
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none ${className}`}
          />
        )
      ) : (
        <div className="bg-white/6 rounded-xl px-4 py-3 border border-white/5">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
}
