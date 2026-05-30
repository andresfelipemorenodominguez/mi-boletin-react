import React from "react";
import { getProfessors } from "@/actions/admin/professors";
import { getGroups } from "@/actions/admin/groups";
import { getSubjects } from "@/actions/admin/subjects";
import { getStudents } from "@/actions/admin/students";
import { getProfessorAssignments } from "@/actions/admin/assignments";
import { AssignmentView } from "@/components/admin/views/AssignmentView";

export default async function AssignmentsPage() {
  const [profResult, groupsResult, subjectsResult, studentsResult, assignmentsResult] = await Promise.all([
    getProfessors(),
    getGroups(),
    getSubjects(),
    getStudents(),
    getProfessorAssignments()
  ]);

  const professors = profResult.success && profResult.data ? profResult.data : [];
  const groups = groupsResult.success && groupsResult.data ? groupsResult.data : [];
  const subjects = subjectsResult.success && subjectsResult.data ? subjectsResult.data : [];
  const students = studentsResult.success && studentsResult.data ? studentsResult.data : [];
  const assignments = assignmentsResult.success && assignmentsResult.data ? assignmentsResult.data : [];

  return (
    <AssignmentView 
      professors={professors} 
      groups={groups} 
      subjects={subjects} 
      students={students} 
      assignments={assignments} 
    />
  );
}
