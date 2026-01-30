// app/admin/success-stories/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Same animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 17, duration: 0.5 },
  },
};

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data – replace with real fetch later
    const mockStories = [
      {
        id: 1,
        studentName: "Priya Sharma",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        university: "University of Toronto",
        course: "MSc Computer Science",
        country: "Canada",
        scholarship: "CAD 25,000",
        visaStatus: "Approved",
        excerpt: "Overseas made my dream come true – full scholarship and visa in record time!",
        published: true,
        dateAdded: "2026-01-15",
      },
      {
        id: 2,
        studentName: "Ahmed Khan",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        university: "University of Melbourne",
        course: "Master of Business Administration",
        country: "Australia",
        scholarship: "AUD 18,000",
        visaStatus: "Approved",
        excerpt: "From rejection to acceptance – the team never gave up on me.",
        published: true,
        dateAdded: "2025-12-10",
      },
      {
        id: 3,
        studentName: "Aisha Patel",
        photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
        university: "Technical University of Munich",
        course: "MSc Data Science",
        country: "Germany",
        scholarship: "€ 12,000",
        visaStatus: "Approved",
        excerpt: "Zero tuition + scholarship – impossible without Overseas guidance.",
        published: false, // draft
        dateAdded: "2026-02-01",
      },
    ];
    setStories(mockStories);
    setLoading(false);
  }, []);

  const filteredStories = stories.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.university.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading success stories...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Success Stories Management" 
          counselorName="Imran" 
          btnName="+ Add New Story" 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            {/* Search */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by student name or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
              />
            </motion.div>

            {/* Table with Photo */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 w-16">Photo</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">Student</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">University</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Course</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Country</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Scholarship</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Visa</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Published</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStories.map((story) => (
                      <motion.tr key={story.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        {/* Photo column */}
                        <td className="px-4 py-3 sm:px-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                            <img
                              src={story.photo}
                              alt={story.studentName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/48?text=User";
                              }}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{story.studentName}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{story.university}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{story.course}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                            {story.country}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium text-green-700">
                          {story.scholarship || "—"}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              story.visaStatus === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {story.visaStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              story.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {story.published ? "Yes" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredStories.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No success stories found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}