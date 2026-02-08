// components/admin/country/countryform/CountryBasicInfo.jsx
export default function CountryBasicInfo({
  formData,
  onChange,
  errors,
  isViewMode,
}) {
  const fields = [
    {
      name: "name",
      label: "Country Name",
      required: true,
      placeholder: "e.g. United States of America",
    },
    {
      name: "continent",
      label: "Continent",
      required: true,
      placeholder: "e.g. North America, Europe, Asia, Africa",
    },
    {
      name: "capital",
      label: "Capital City",
      required: true,
      placeholder: "e.g. Washington D.C., Ottawa, London",
    },
    {
      name: "visaSuccessRate",
      label: "Visa Success Rate",
      required: true,
      placeholder: "e.g. 92%, 85-90%, High",
    },
    {
      name: "popularCourses",
      label: "Popular Courses (comma-separated)",
      required: true,
      placeholder:
        "e.g. Computer Science, Business Administration, Engineering, Medicine",
    },
    {
      name: "careerOpportunities",
      label: "Career Opportunities (comma-separated)",
      required: true,
      placeholder:
        "e.g. High-paying tech jobs, Post-study work visa up to 3 years, OPT extension",
    },
    {
      name: "scholarships",
      label: "Scholarships (comma-separated)",
      required: true,
      placeholder:
        "e.g. Fulbright Scholarship, University merit awards, Government grants",
    },
    {
      name: "eligibilityRequirements",
      label: "Eligibility Requirements (comma-separated)",
      required: true,
      placeholder:
        "e.g. Bachelor’s degree, IELTS 6.5+, GPA 3.0+, Financial proof",
    },
    {
      name: "topUniversities",
      label: "Top Universities (comma-separated)",
      required: true,
      placeholder:
        "e.g. Harvard University, Stanford University, MIT, UC Berkeley",
    },
  ];

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={onChange}
            disabled={isViewMode}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors[field.name] ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder={field.placeholder}
          />
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}