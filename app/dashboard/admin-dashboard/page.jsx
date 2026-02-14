"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import KpiCards from "@/components/admindashboard/KpiCards";
import StudentPipeline from "@/components/admindashboard/StudentPipeline";
import VisaStatus from "@/components/admindashboard/VisaStatus";
import UpcomingDeadlines from "@/components/admindashboard/UpcomingDeadlines";
import RevenueOverview from "@/components/admindashboard/RevenueOverview";
import TopCounselors from "@/components/admindashboard/TopCounselors";

import AdminManagementSection from "@/components/adminform/addadmin/AdminManagementSection";
import ConfirmationModal from "@/components/adminform/confirmmsg";

/* ===================== RBAC CONFIG ===================== */

// normalize role coming from DB / UI
const normalizeRole = (role = "") =>
  role.trim().toLowerCase().replace(/\s+/g, "_");

/* ===================== PAGE ===================== */

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [pendingDeleteAdmin, setPendingDeleteAdmin] = useState(null);

  const [showAdminSection, setShowAdminSection] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const CounselorName = user?.name;

  /* ===================== MODAL STATE ===================== */

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  /* ===================== HANDLERS ===================== */

  const handleAdminAdded = async () => {
    setShowAdminSection(false);
    setLoadingAdmins(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/admin-users`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (res.ok) {
        setAdmins(
          data.users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
          })),
        );
      }
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/admin-users`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (res.ok) {
          setAdmins(
            data.users.map((u) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              role: u.role,
            })),
          );
        }
      } catch (err) {
        console.error("Failed to fetch admins", err);
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, []);

  // 🔥 MAIN DELETE LOGIC (RBAC)
  const handleDeleteAdmin = (targetAdmin) => {
    const currentRole = normalizeRole(user?.role);
    const targetRole = normalizeRole(targetAdmin.role);

    console.log("CURRENT:", currentRole);
    console.log("TARGET:", targetRole);

    // ❌ nobody can delete super admin
    if (targetRole === "super_admin") {
      setModalMessage(`You cannot remove ${targetAdmin.name}.`);
      setShowModal(true);
      return;
    }

    // ✅ super admin can delete anyone else
    if (currentRole === "super_admin") {
      setPendingDeleteId(targetAdmin.id);
      setPendingDeleteAdmin(targetAdmin);
      setModalMessage(`Are you sure you want to delete ${targetAdmin.name}?`);

      setShowModal(true);
      return;
    }

    // ❌ admin permissions
    if (currentRole === "admin") {
      if (["editor", "counselor"].includes(targetRole)) {
        setPendingDeleteId(targetAdmin.id);
        setPendingDeleteAdmin(targetAdmin);
        setModalMessage(`Are you sure you want to delete ${targetAdmin.name}?`);
        setShowModal(true);
        return;
      }

      setModalMessage(`You cannot remove ${targetAdmin.role}.`);
      setShowModal(true);
      return;
    }

    // ❌ everyone else
    setModalMessage("You are not allowed to delete roles.");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/admin-users/${pendingDeleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setModalMessage(data.message || "Delete failed");
        setPendingDeleteId(null);
        setPendingDeleteAdmin(null);
        setShowModal(false);
        return;
      }

      // ✅ backend success → update UI
      setAdmins((prev) => prev.filter((a) => a.id !== pendingDeleteId));

      setPendingDeleteId(null);
      setPendingDeleteAdmin(null);
      setShowModal(false);
    } catch (err) {
      console.error("Delete error:", err);
      setModalMessage("Network error. Please try again.");
      setPendingDeleteId(null);
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <DashboardHeader
          title="Admin Dashboard"
          counselorName={CounselorName}
          btnName="+ Add Role"
          onButtonClick={() => setShowAdminSection(true)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* ADMIN MANAGEMENT */}
          {showAdminSection && (
            <AdminManagementSection
              admins={admins}
              onClose={() => setShowAdminSection(false)}
              onAddAdmin={handleAdminAdded}
              onDeleteAdmin={handleDeleteAdmin}
            />
          )}

          {/* DASHBOARD CONTENT */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.96 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 140, damping: 17 },
                },
              }}
            >
              <KpiCards />
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <motion.div className="lg:col-span-2">
                <StudentPipeline />
              </motion.div>
              <motion.div>
                <VisaStatus />
              </motion.div>
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingDeadlines />
              <motion.div className="space-y-6">
                <RevenueOverview />
                <TopCounselors />
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* CONFIRM / BLOCK MODAL */}
      {showModal && (
        <ConfirmationModal
          title="Action Restricted"
          message={modalMessage}
          confirmText={pendingDeleteId ? "Delete" : "Okay"}
          cancelText="Close"
          confirmVariant={pendingDeleteId ? "danger" : "primary"}
          onConfirm={
            pendingDeleteId ? confirmDelete : () => setShowModal(false)
          }
          onCancel={() => {
            setShowModal(false);
            setPendingDeleteId(null);
            setPendingDeleteAdmin(null);
          }}
        />
      )}
    </div>
  );
}
