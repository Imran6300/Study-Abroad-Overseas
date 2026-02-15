"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUniversities } from "@/store/universitySlice";

export default function UniversityInitializer({ children }) {
  const dispatch = useDispatch();
  const universities = useSelector((state) => state.universities.list);

  useEffect(() => {
    if (universities.length === 0) {
      dispatch(fetchUniversities());
    }
  }, [dispatch, universities.length]);

  return children;
}
