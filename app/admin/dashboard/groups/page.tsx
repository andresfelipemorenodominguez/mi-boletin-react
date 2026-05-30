import React from "react";
import { getGroups } from "@/actions/admin/groups";
import { getPeriods } from "@/actions/admin/periods";
import { GroupView } from "@/components/admin/views/GroupView";

export default async function GroupsPage() {
  const [groupsResult, periodsResult] = await Promise.all([
    getGroups(),
    getPeriods()
  ]);

  const groups = groupsResult.success && groupsResult.data ? groupsResult.data : [];
  const periods = periodsResult.success && periodsResult.data ? periodsResult.data : [];

  return <GroupView groups={groups} periods={periods} />;
}
