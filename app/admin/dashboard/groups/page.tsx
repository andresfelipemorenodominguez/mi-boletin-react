import React from "react";
import { getGroups } from "@/actions/admin/groups";
import { getPeriods } from "@/actions/admin/periods";
import { getGrades } from "@/actions/admin/grades";
import { GroupView } from "@/components/admin/views/GroupView";

export default async function GroupsPage() {
  const [groupsResult, periodsResult, gradesResult] = await Promise.all([
    getGroups(),
    getPeriods(),
    getGrades()
  ]);

  const groups = groupsResult.success && groupsResult.data ? groupsResult.data : [];
  const periods = periodsResult.success && periodsResult.data ? periodsResult.data : [];
  const grades = gradesResult.success && gradesResult.data ? gradesResult.data : [];

  return <GroupView groups={groups} periods={periods} grades={grades} />;
}
