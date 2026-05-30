import React from "react";
import { getStudents } from "@/actions/admin/students";
import { StudentView } from "@/components/admin/views/StudentView";

export default async function StudentsPage() {
  const result = await getStudents();
  const students = result.success && result.data ? result.data : [];

  return <StudentView students={students} />;
}
