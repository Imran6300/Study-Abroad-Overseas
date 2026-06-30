"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MessageBox from "@/components/ui/MessageBox";

import {
  User,
  Mail,
  GraduationCap,
  Globe,
  Calendar,
  Pencil,
  Save,
} from "lucide-react";

const qualificationOptions = [
  "High School",
  "Diploma",
  "Bachelor",
  "Master",
  "PhD",
];

const intakeOptions = ["Spring", "Summer", "Fall", "Winter", "Other"];

export default function ProfilePage() {
  const { user, loading } = useSelector((state) => state.auth);
  const [profileExists, setProfileExists] = useState(false);

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const isLoggedIn = Boolean(user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(""); // ← NEW: for showing error message

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpa: "",
    preferredCountry: "",
    intendedIntake: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
  });

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
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
          { credentials: "include" },
        );

        if (res.status === 404) {
          setProfileExists(false);

          setFormData({
            fullName: user?.name || "",
            email: user?.email || "",
            qualification: "",
            fieldOfStudy: "",
            graduationYear: "",
            gpa: "",
            preferredCountry: "",
            intendedIntake: "",
            dateOfBirth: "",
            gender: "",
            nationality: "",
            passportNumber: "",
            passportExpiry: "",
          });

          return;
        }

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to fetch profile");
          return;
        }
        const profile = data?.data || {};

        setProfileExists(true);

        setFormData({
          fullName: profile.fullName || user?.name || "",
          email: profile.email || user?.email || "",
          phone: profile.phone || "",
          qualification: profile.qualification || "",
          fieldOfStudy: profile.fieldOfStudy || "",
          graduationYear: profile.graduationYear || "",
          gpa: profile.gpa || "",
          preferredCountry: profile.preferredCountry || "",
          intendedIntake: profile.intendedIntake || "",
          dateOfBirth: profile.dateOfBirth?.split("T")[0] || "",
          gender: profile.gender || "",
          nationality: profile.nationality || "",
          passportNumber: profile.passportNumber || "",
          passportExpiry: profile.passportExpiry?.split("T")[0] || "",
        });

        if (profile.profilePicture?.secure_url) {
          setImagePreview(profile.profilePicture.secure_url);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.qualification) {
      newErrors.qualification = "Please select qualification";
    }

    if (!formData.intendedIntake) {
      newErrors.intendedIntake = "Please select intended intake";
    }

    if (formData.gpa && isNaN(formData.gpa)) {
      newErrors.gpa = "GPA must be a number";
    }

    if (
      formData.graduationYear &&
      (formData.graduationYear < 1950 ||
        formData.graduationYear > new Date().getFullYear() + 6)
    ) {
      newErrors.graduationYear = "Enter valid graduation year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setApiError("");
    setApiSuccess("");

    if (!validateForm()) return;

    try {
      setSaving(true);

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key] || "");
      });

      if (imageFile) {
        form.append("profilePicture", imageFile);
      }

      const url = profileExists
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`;

      const method = profileExists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong");
        return;
      }

      setApiSuccess("Profile updated successfully 🎉");
      setProfileExists(true);
      setIsEditing(false);
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b  space-y-10   px-6 pb-16 text-white">
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
      <MessageBox
        status={apiSuccess ? "success" : apiError ? "error" : null}
        message={apiSuccess || apiError}
        onClose={() => {
          setApiSuccess("");
          setApiError("");
        }}
      />

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
            name="fullName"
            value={formData.fullName}
            editing={isEditing}
            onChange={handleChange}
            error={errors.fullName}
          />
          <Field
            label="Email"
            name="email"
            value={formData.email}
            editing={false}
            error={errors.email}
          />
          <Field
            label="Phone Number"
            name="phone"
            value={formData.phone}
            editing={isEditing}
            onChange={handleChange}
            error={errors.phone}
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
            options={qualificationOptions}
            className="cursor-pointer"
            error={errors.qualification}
          />
          <Field
            label="Field of Study"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            editing={isEditing}
            onChange={handleChange}
            error={errors.fieldOfStudy}
          />
          <Field
            label="Graduation Year"
            name="graduationYear"
            value={formData.graduationYear}
            editing={isEditing}
            onChange={handleChange}
            error={errors.graduationYear}
          />
          <Field
            label="GPA / Percentage"
            name="gpa"
            value={formData.gpa}
            editing={isEditing}
            onChange={handleChange}
            error={errors.gpa}
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
            error={errors.preferredCountry}
          />
          <Field
            label="Intended Intake"
            name="intendedIntake"
            value={formData.intendedIntake}
            editing={isEditing}
            onChange={handleChange}
            options={intakeOptions}
            className="cursor-pointer"
            error={errors.intendedIntake}
          />
        </Section>

        <Section title="Identity Info" icon={Globe}>
          <Field
            label="Date Of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            editing={isEditing}
            onChange={handleChange}
            type="date"
            className="cursor-pointer"
            error={errors.dateOfBirth}
          />
          <Field
            label="Gender"
            name="gender"
            value={formData.gender}
            editing={isEditing}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
            className="cursor-pointer"
            error={errors.gender}
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
            error={errors.nationality}
          />
          <Field
            label="Passport Number"
            name="passportNumber"
            value={formData.passportNumber}
            editing={isEditing}
            onChange={handleChange}
            error={errors.passportNumber}
          />
          <Field
            label="Passport Expiry"
            name="passportExpiry"
            value={formData.passportExpiry}
            editing={isEditing}
            onChange={handleChange}
            type="date"
            className="cursor-pointer"
            error={errors.passportExpiry}
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
              disabled={saving}
              className={`${
                saving ? "bg-gray-400 cursor-not-allowed" : "bg-[#32CD32]"
              } text-black px-6 py-3 rounded-xl flex items-center gap-2 font-semibold`}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
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
  error,
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>

      {editing ? (
        options ? (
          <select
            name={name}
            value={value ?? ""}
            onChange={onChange}
            className={`w-full bg-white/10 border ${
              error ? "border-red-500" : "border-white/20"
            } rounded-xl px-4 py-3 text-white focus:outline-none ${className}`}
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
            value={value ?? ""}
            onChange={onChange}
            className={`w-full bg-white/10 border ${
              error ? "border-red-500" : "border-white/20"
            } rounded-xl px-4 py-3 text-white focus:outline-none ${className}`}
          />
        )
      ) : (
        <div className="bg-white/6 rounded-xl px-4 py-3 border border-white/5">
          {value || "Not provided"}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
