export default function VisaCoreFields({ form, handleChange, isView }) {
  const Field = ({ label, name, type="text", required }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {isView ? (
        <p className="font-medium">{form[name] || "—"}</p>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-2.5 border rounded-lg"
        />
      )}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Field label="Student Name" name="studentName" required />
      <Field label="Passport No" name="passportNo" required />
      <Field label="Country" name="country" required />
      <Field label="Visa Type" name="visaType" required />
      <Field label="Expected Decision" name="expectedDecision" type="date" />
      <Field label="Counselor" name="counselor" />
    </div>
  );
}
