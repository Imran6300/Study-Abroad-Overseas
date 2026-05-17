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
    return <div className="text-white">Loading visa progress...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!visa) {
    return <div className="text-gray-400">No visa progress found</div>;
  }

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">Visa Progress</h1>

      <VisaProgress visa={visa} />
    </div>
  );
}
