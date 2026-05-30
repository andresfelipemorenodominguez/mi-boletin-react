import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await prisma.notificacion.updateMany({
    where: { id_admin: parseInt(session.user.id), leida: false },
    data: { leida: true },
  });

  return NextResponse.json({ success: true });
}
