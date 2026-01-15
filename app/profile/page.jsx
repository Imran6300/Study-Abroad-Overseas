"use client";

import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#f5f7ff] pt-28 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-[#0f2a5f] mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
}
