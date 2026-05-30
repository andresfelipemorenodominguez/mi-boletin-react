import React from "react";
import { getSummaryForReport } from "@/actions/admin/reports";
import { ReportView } from "@/components/admin/views/ReportView";

export default async function ReportsPage() {
  const result = await getSummaryForReport();
  
  const initialSummary = result.success && result.data ? result.data : {
    estudiantesActivos: 0,
    estudiantesInactivos: 0,
    profesoresActivos: 0,
    totalSolicitudes: 0
  };

  return <ReportView initialSummary={initialSummary} />;
}
