import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/admin/views/ProfileView";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect("/admin/login");
  }

  const admin = await prisma.administrador.findUnique({
    where: { correo_electronico: session.user.email },
    select: { nombre_completo: true, correo_electronico: true }
  });

  if (!admin) {
    return <div>Error: Administrador no encontrado.</div>;
  }

  return <ProfileView admin={admin} />;
}
