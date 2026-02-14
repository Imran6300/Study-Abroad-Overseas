"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSuccess, authChecked } from "@/store/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            credentials: "include",
          },
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(authSuccess(data.user));
        } else {
          // ❗ IMPORTANT: DO NOT LOGOUT
          dispatch(authChecked());
        }
      } catch (err) {
        // ❗ STILL DO NOT LOGOUT
        dispatch(authChecked());
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
}
