"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSuccess } from "@/store/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          "https://overseas-backend-production-4f18.up.railway.app/auth/me",
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(authSuccess(data.user));
        } else {
          // ❗ IMPORTANT: DO NOT LOGOUT
          dispatch({ type: "auth/authChecked" });
        }
      } catch (err) {
        // ❗ STILL DO NOT LOGOUT
        dispatch({ type: "auth/authChecked" });
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
}
