import React from "react";
import { getSubjects } from "@/actions/admin/subjects";
import { SubjectView } from "@/components/admin/views/SubjectView";

export default async function SubjectsPage() {
  const result = await getSubjects();
  const subjects = result.success && result.data ? result.data : [];

  return <SubjectView subjects={subjects} />;
}
