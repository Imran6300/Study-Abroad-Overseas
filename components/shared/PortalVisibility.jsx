"use client";

import { useSelector } from "react-redux";
import { selectIsCounselorStudent } from "@/store/authSelectors";

export function PublicOnly({ children }) {
  const isCounselorStudent = useSelector(selectIsCounselorStudent);

  if (isCounselorStudent) return null;

  return children;
}

export function CounselorStudentOnly({ children }) {
  const isCounselorStudent = useSelector(selectIsCounselorStudent);

  if (!isCounselorStudent) return null;

  return children;
}
