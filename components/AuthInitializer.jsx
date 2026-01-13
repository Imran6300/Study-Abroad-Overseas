"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authSuccess, logout } from "@/store/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3020/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        dispatch(authSuccess(data.user));
      } catch {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
}
