import React from "react";
import { getPeriods } from "@/actions/admin/periods";
import { PeriodView } from "@/components/admin/views/PeriodView";

export default async function PeriodsPage() {
  const result = await getPeriods();
  const periods = result.success && result.data ? result.data : [];

  return <PeriodView periods={periods} />;
}
