export default function VisaCoreFields({
  form,
  handleChange,
  isView,
  students,
  counselors,
  applications,
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* STUDENT */}
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>

        {isView ? (
          <p className="font-medium">{form.student || "—"}</p>
        ) : (
          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg"
            required
          >
            <option value="">Select Student</option>

            {students?.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* COUNSELOR */}
      <div>
        <label className="block text-sm font-medium mb-1">Counselor</label>

        {isView ? (
          <p className="font-medium">{form.counselor || "—"}</p>
        ) : (
          <select
            name="counselor"
            value={form.counselor}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg"
            required
          >
            <option value="">Select Counselor</option>

            {counselors?.map((counselor) => (
              <option key={counselor._id} value={counselor._id}>
                {counselor.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* APPLICATION */}
      <div>
        <label className="block text-sm font-medium mb-1">
          University Application
        </label>

        {isView ? (
          <p className="font-medium">{form.universityApplication || "—"}</p>
        ) : (
          <select
            name="universityApplication"
            value={form.universityApplication}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg"
            required
          >
            <option value="">Select Application</option>

            {applications?.map((app) => (
              <option key={app._id} value={app._id}>
                {app.university?.name || "University"}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* COUNTRY */}
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>

        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded-lg"
          required
          disabled={isView}
        />
      </div>

      {/* VISA TYPE */}
      <div>
        <label className="block text-sm font-medium mb-1">Visa Type</label>

        <input
          type="text"
          name="visaType"
          value={form.visaType}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded-lg"
          required
          disabled={isView}
        />
      </div>

      {/* EMBASSY WEBSITE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Embassy Website
        </label>

        <input
          type="text"
          name="embassyWebsite"
          value={form.embassyWebsite}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded-lg"
          disabled={isView}
        />
      </div>

      {/* EXPECTED DECISION */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Expected Decision
        </label>

        <input
          type="date"
          name="expectedDecision"
          value={form.expectedDecision}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border rounded-lg"
          disabled={isView}
        />
      </div>
    </div>
  );
}
