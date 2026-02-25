"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authSuccess, authFail } from "@/store/authSlice";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(authFail(data?.errors?.[0] || "Invalid OTP"));
        return;
      }

      // ✅ Save user to Redux
      dispatch(authSuccess(data.user));

      router.replace("/");
    } catch (err) {
      dispatch(authFail("Server error"));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-3">Verify OTP</h2>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
          placeholder="Enter 6-digit OTP"
        />

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-green-500 text-white rounded-md"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
