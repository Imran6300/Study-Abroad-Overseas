"use client";

import UniversitiesList from "@/components/userdashboard/UniversitiesList";

export default function UniversitiesPage() {
  const universities = [
    {
      name: "University of Melbourne",
      program: "MS Computer Science",
      match: 92,
    },
    {
      name: "University of Toronto",
      program: "MBA",
      match: 88,
    },
    {
      name: "Imperial College London",
      program: "Data Science",
      match: 85,
    },
    {
      name: "University of British Columbia",
      program: "Software Engineering",
      match: 82,
    },
    {
      name: "University of Sydney",
      program: "Artificial Intelligence",
      match: 80,
    },
  ];

  return (
    <div className="min-h-screen space-y-10 pt-16 sm:pt-5 text-white">
      {/* Page Header */}
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold">Universities</h1>

        <p className="text-gray-400 mt-1">
          Explore universities that match your profile
        </p>
      </div>

      {/* Universities Component */}
      <UniversitiesList universities={universities} />
    </div>
  );
}
