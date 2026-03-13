export default function PersonalSection({ data, updateForm }) {
  const input = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300";

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-300 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Personal Information
      </h3>

      <input
        className={input}
        placeholder="Full Name"
        value={data.fullName || ""}
        onChange={(e) => updateForm({ fullName: e.target.value })}
      />

      <input
        type="date"
        className={input}
        value={data.dob || ""}
        onChange={(e) => updateForm({ dob: e.target.value })}
      />

      <select
        className={input}
        value={data.gender || ""}
        onChange={(e) => updateForm({ gender: e.target.value })}
      >
        <option value="">Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input
        className={input}
        placeholder="Nationality"
        value={data.nationality || ""}
        onChange={(e) => updateForm({ nationality: e.target.value })}
      />

      <input
        className={input}
        placeholder="Passport Number"
        value={data.passportNumber || ""}
        onChange={(e) => updateForm({ passportNumber: e.target.value })}
      />

      <input
        type="date"
        className={input}
        value={data.passportExpiry || ""}
        onChange={(e) => updateForm({ passportExpiry: e.target.value })}
      />

      <input
        className={input}
        placeholder="Mobile"
        value={data.mobile || ""}
        onChange={(e) => updateForm({ mobile: e.target.value })}
      />

      <input
        className={input}
        placeholder="WhatsApp"
        value={data.whatsapp || ""}
        onChange={(e) => updateForm({ whatsapp: e.target.value })}
      />

      <input
        className={input}
        placeholder="Email"
        value={data.email || ""}
        onChange={(e) => updateForm({ email: e.target.value })}
      />

      <textarea
        className={input}
        placeholder="Address"
        value={data.address || ""}
        onChange={(e) => updateForm({ address: e.target.value })}
      />

      <input
        className={input}
        placeholder="Emergency Contact Name"
        value={data.emergencyName || ""}
        onChange={(e) => updateForm({ emergencyName: e.target.value })}
      />

      <input
        className={input}
        placeholder="Emergency Relation"
        value={data.emergencyRelation || ""}
        onChange={(e) => updateForm({ emergencyRelation: e.target.value })}
      />

      <input
        className={input}
        placeholder="Emergency Phone"
        value={data.emergencyPhone || ""}
        onChange={(e) => updateForm({ emergencyPhone: e.target.value })}
      />
    </div>
  );
}
