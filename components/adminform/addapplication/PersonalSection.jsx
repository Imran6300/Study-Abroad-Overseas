export default function PersonalSection({ data = {}, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";
  const label = "text-sm font-medium text-gray-700";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">
        Personal Information
      </h3>

      {/* Full Name */}
      <div className="space-y-1">
        <label className={label}>Full Name</label>
        <input
          className={input}
          value={data?.fullName || ""}
          onChange={(e) => updateForm({ fullName: e.target.value })}
        />
      </div>

      {/* Date of Birth */}
      <div className="space-y-1">
        <label className={label}>Date of Birth</label>
        <input
          type="date"
          className={input}
          value={
            data?.dob ? new Date(data.dob).toISOString().split("T")[0] : ""
          }
          onChange={(e) => updateForm({ dob: e.target.value })}
        />
      </div>

      {/* Gender */}
      <div className="space-y-1">
        <label className={label}>Gender</label>
        <select
          className={input}
          value={data?.gender || ""}
          onChange={(e) => updateForm({ gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      {/* Nationality */}
      <div className="space-y-1">
        <label className={label}>Nationality</label>
        <input
          className={input}
          value={data?.nationality || ""}
          onChange={(e) => updateForm({ nationality: e.target.value })}
        />
      </div>

      {/* Passport Number */}
      <div className="space-y-1">
        <label className={label}>Passport Number</label>
        <input
          className={input}
          value={data?.passportNumber || ""}
          onChange={(e) => updateForm({ passportNumber: e.target.value })}
        />
      </div>

      {/* Passport Expiry */}
      <div className="space-y-1">
        <label className={label}>Passport Expiry</label>
        <input
          type="date"
          className={input}
          value={
            data?.passportExpiry
              ? new Date(data.passportExpiry).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) => updateForm({ passportExpiry: e.target.value })}
        />
      </div>

      {/* Mobile */}
      <div className="space-y-1">
        <label className={label}>Mobile</label>
        <input
          className={input}
          value={data?.mobile || ""}
          onChange={(e) => updateForm({ mobile: e.target.value })}
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-1">
        <label className={label}>WhatsApp</label>
        <input
          className={input}
          value={data?.whatsapp || ""}
          onChange={(e) => updateForm({ whatsapp: e.target.value })}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className={label}>Email</label>
        <input
          className={input}
          value={data?.email || ""}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className={label}>Address</label>
        <textarea
          className={input}
          value={data?.address || ""}
          onChange={(e) => updateForm({ address: e.target.value })}
        />
      </div>

      {/* Emergency Contact Name */}
      <div className="space-y-1">
        <label className={label}>Emergency Contact Name</label>
        <input
          className={input}
          value={data?.emergencyContact?.name || ""}
          onChange={(e) =>
            updateForm({
              emergencyContact: {
                ...data?.emergencyContact,
                name: e.target.value,
              },
            })
          }
        />
      </div>

      {/* Emergency Relation */}
      <div className="space-y-1">
        <label className={label}>Emergency Relation</label>
        <input
          className={input}
          value={data?.emergencyContact?.relation || ""}
          onChange={(e) =>
            updateForm({
              emergencyContact: {
                ...data?.emergencyContact,
                relation: e.target.value,
              },
            })
          }
        />
      </div>

      {/* Emergency Phone */}
      <div className="space-y-1">
        <label className={label}>Emergency Phone</label>
        <input
          className={input}
          value={data?.emergencyContact?.phone || ""}
          onChange={(e) =>
            updateForm({
              emergencyContact: {
                ...data?.emergencyContact,
                phone: e.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
}
