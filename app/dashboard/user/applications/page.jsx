"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApplicationsCard from "@/components/userdashboard/ApplicationsCard";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle } from "lucide-react";
import ConfirmationModal from "@/components/adminform/confirmmsg";

export default function ApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "danger",
    onConfirm: null,
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await res.json();

        if (data.success) {
          const formatted = data.applications.map((app) => ({
            _id: app._id,
            applicationId: app.applicationId,
            universityEntryId: app.universityEntryId,
            slug: app.slug,
            university: app.university,
            course: app.course,
            country: app.country,
            logo: app.logo,
            status: app.status,
            date: app.date,
          }));

          setApplications(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleWithdraw = (applicationId, universityEntryId) => {
    setModal({
      open: true,
      title: "Withdraw Application",
      message:
        "Are you sure you want to withdraw this application? This action cannot be undone from your dashboard.",
      confirmText: "Withdraw",
      confirmVariant: "danger",

      onConfirm: async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/${applicationId}/withdraw`,
            {
              method: "DELETE",
              credentials: "include",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                universityEntryId,
              }),
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to withdraw application");
          }

          // remove instantly from UI
          setApplications((prev) =>
            prev.filter((app) => app.universityEntryId !== universityEntryId),
          );

          // success modal
          setModal({
            open: true,
            title: "Application Withdrawn",
            message: "Your application has been withdrawn successfully.",
            confirmText: "OK",
            confirmVariant: "success",
            onConfirm: () =>
              setModal((prev) => ({
                ...prev,
                open: false,
              })),
          });
        } catch (err) {
          console.error(err);

          setModal({
            open: true,
            title: "Error",
            message: err.message || "Something went wrong.",
            confirmText: "OK",
            confirmVariant: "danger",
            onConfirm: () =>
              setModal((prev) => ({
                ...prev,
                open: false,
              })),
          });
        }
      },
    });
  };

  const total = applications.length;

  const accepted = applications.filter(
    (a) => a.status === "Enrolled" || a.status === "Offer Received",
  ).length;
  const review = applications.filter(
    (a) =>
      a.status === "Application Started" ||
      a.status === "Application Submitted",
  ).length;

  if (loading) {
    return (
      <div className="pt-20 text-center text-gray-400">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{
            background: `
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary) 14%, var(--brand-bg)),
      var(--brand-bg)
    )
  `,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: `
    0 8px 32px rgba(0,0,0,0.25),
    0 0 24px color-mix(
      in srgb,
      var(--brand-primary) 20%,
      transparent
    )
  `,
          }}
          className="backdrop-blur-xl rounded-2xl p-6 flex items-center justify-between"
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
            <p
              style={{
                color: "var(--brand-primary)",
              }}
              className="text-3xl font-bold  mt-1"
            >
              {accepted}
            </p>
          </div>

          <CheckCircle
            style={{
              color: "var(--brand-primary)",
            }}
            size={26}
          />
        </motion.div>
      </div>

      {/* APPLICATION LIST */}
      <ApplicationsCard
        applications={applications}
        handleWithdraw={handleWithdraw}
        router={router}
      />

      {modal.open && (
        <ConfirmationModal
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          confirmVariant={modal.confirmVariant}
          onConfirm={
            modal.onConfirm ||
            (() =>
              setModal((prev) => ({
                ...prev,
                open: false,
              })))
          }
          onCancel={() =>
            setModal((prev) => ({
              ...prev,
              open: false,
            }))
          }
        />
      )}
    </div>
  );
}
