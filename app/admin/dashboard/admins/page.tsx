import React from "react";
import { getAdmins } from "@/actions/admin/admins";
import { AdminView } from "@/components/admin/views/AdminView";

export default async function AdminsPage() {
  const result = await getAdmins();
  const admins = result.success && result.data ? result.data : [];

  return <AdminView admins={admins} />;
}
