import React from "react";
import { getProfessors } from "@/actions/admin/professors";
import { ProfessorView } from "@/components/admin/views/ProfessorView";

export default async function ProfessorsPage() {
  const result = await getProfessors();
  const professors = result.success && result.data ? result.data : [];

  return <ProfessorView professors={professors} />;
}
