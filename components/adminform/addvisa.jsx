"use client";

import { useState, useEffect } from "react";

import VisaStatusSection from "./visaform/VisaStatusSection";
import VisaCoreFields from "./visaform/VisaCoreFields";
import VisaFormActions from "./visaform/VisaFormActions";

export default function VisaCaseForm({
  mode = "add",
  initialData,
  onSuccess,
  onCancel,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    student: "",

    counselor: "",

    universityApplication: "",

    country: "",

    embassyWebsite: "",

    visaType: "",

    status: "Under Review",

    submissionDate: "",

    expectedDecision: "",
  });

  // DROPDOWN DATA
  const [students, setStudents] = useState([]);

  const [counselors, setCounselors] = useState([]);

  const [applications, setApplications] = useState([]);

  // LOAD INITIAL DATA
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,

        expectedDecision: initialData.expectedDecision?.split("T")[0] || "",
      }));
    }
  }, [initialData]);

  // LOAD STUDENTS + COUNSELORS
  useEffect(() => {
    const loadData = async () => {
      try {
        const studentRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students`,
          {
            credentials: "include",
          },
        );

        const counselorRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/counselors`,
          {
            credentials: "include",
          },
        );

        const studentData = await studentRes.json();

        const counselorData = await counselorRes.json();

        setStudents(studentData.students || []);

        setCounselors(counselorData.counselors || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  // LOAD APPLICATIONS WHEN STUDENT CHANGES
  useEffect(() => {
    if (!form.student) return;

    const loadApplications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/student/${form.student}`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadApplications();
  }, [form.student]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    if (isView) return;

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isView) return;

    onSuccess(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <VisaStatusSection
        status={form.status}
        setStatus={(status) =>
          setForm((p) => ({
            ...p,
            status,
          }))
        }
        mode={mode}
      />

      <VisaCoreFields
        form={form}
        handleChange={handleChange}
        isView={isView}
        students={students}
        counselors={counselors}
        applications={applications}
      />

      <VisaFormActions isView={isView} isAdd={isAdd} onCancel={onCancel} />
    </form>
  );
}
