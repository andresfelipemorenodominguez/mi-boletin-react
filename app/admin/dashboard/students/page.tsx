import React from "react";
import { getStudents } from "@/actions/admin/students";
import { getGroups } from "@/actions/admin/groups";
import { StudentView } from "@/components/admin/views/StudentView";

export default async function StudentsPage() {
  const [studentsResult, groupsResult] = await Promise.all([
    getStudents(),
    getGroups()
  ]);

  const students = studentsResult.success && studentsResult.data ? studentsResult.data : [];
  const groups = groupsResult.success && groupsResult.data ? groupsResult.data : [];

  return <StudentView students={students} groups={groups} />;
}
