"use client";

import { useRouter } from "next/navigation";
import ApplicationsCard from "@/components/userdashboard/ApplicationsCard";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle } from "lucide-react";

export default function ApplicationsPage() {
  const router = useRouter();

  const applications = [
    {
      id: 1,
      university: "University of Toronto",
      course: "MSc Computer Science",
      country: "Canada",
      status: "Under Review",
      date: "12 Mar 2026",
    },
    {
      id: 2,
      university: "Harvard University",
      course: "MBA",
      country: "USA",
      status: "Accepted",
      date: "05 Mar 2026",
    },
  ];

  const handleWithdraw = (id) => {
    console.log("withdraw", id);
  };

  const total = applications.length;
  const accepted = applications.filter((a) => a.status === "Accepted").length;
  const review = applications.filter((a) => a.status === "Under Review").length;

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-gray-400 text-sm">Total Applications</h3>
            <p className="text-3xl font-bold text-white mt-1">{total}</p>
          </div>

          <FileText className="text-gray-400" size={26} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-gray-400 text-sm">Under Review</h3>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{review}</p>
          </div>

          <Clock className="text-yellow-400" size={26} />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-gray-400 text-sm">Accepted</h3>
            <p className="text-3xl font-bold text-[#32CD32] mt-1">{accepted}</p>
          </div>

          <CheckCircle className="text-[#32CD32]" size={26} />
        </motion.div>
      </div>

      {/* APPLICATION LIST */}
      <ApplicationsCard
        applications={applications}
        handleWithdraw={handleWithdraw}
        router={router}
      />
    </div>
  );
}
