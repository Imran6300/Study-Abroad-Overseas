"use client";

import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import VisaProgress from "@/components/userdashboard/VisaProgress";

import { fetchMyVisa } from "@/store/actions/visaActions";

export default function VisaPage() {
  const dispatch = useDispatch();

  const { visa, loading, error } = useSelector((state) => state.visa);

  useEffect(() => {
    dispatch(fetchMyVisa());
  }, [dispatch]);
  if (loading) {
    return (
      <div
        style={{
          color: "var(--brand-accent)",
        }}
      >
        Loading visa progress...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!visa) {
    return (
      <div
        style={{
          color: "var(--brand-text-secondary)",
        }}
      >
        No visa progress found
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1
        className="text-3xl font-bold mb-6"
        style={{
          color: "var(--brand-accent)",
        }}
      >
        Visa Progress
      </h1>

      <VisaProgress visa={visa} />
    </div>
  );
}
