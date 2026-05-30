import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const adminId = parseInt(session.user.id);

  const notifications = await prisma.notificacion.findMany({
    where: { id_admin: adminId },
    orderBy: { fecha_creacion: "desc" },
    take: 30,
  });

  const unreadCount = await prisma.notificacion.count({
    where: { id_admin: adminId, leida: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const adminId = parseInt(session.user.id);
  const body = await req.json();

  const notification = await prisma.notificacion.create({
    data: {
      id_admin: adminId,
      tipo: body.tipo ?? "info",
      titulo: body.titulo,
      mensaje: body.mensaje,
      href: body.href ?? null,
    },
  });

  return NextResponse.json(notification, { status: 201 });
}
