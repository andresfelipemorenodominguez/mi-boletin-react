"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentsForReport(grado?: string, grupo?: string) {
  try {
    const where: any = {};
    if (grado) where.grado = grado;
    if (grupo) where.grupo = grupo;

    const students = await prisma.estudiante.findMany({
      where,
      orderBy: [
        { grado: "asc" },
        { grupo: "asc" },
        { nombre_completo: "asc" }
      ],
      select: {
        codigo_estudiante: true,
        nombre_completo: true,
        correo_electronico: true,
        grado: true,
        grupo: true,
        estado: true,
      }
    });
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students for report:", error);
    return { success: false, error: "Error al obtener estudiantes" };
  }
}

export async function getProfessorsForReport() {
  try {
    const professors = await prisma.profesor.findMany({
      orderBy: { nombre_completo: "asc" },
      select: {
        codigo_profesor: true,
        nombre_completo: true,
        correo_electronico: true,
        telefono: true,
        estado: true,
      }
    });
    return { success: true, data: professors };
  } catch (error) {
    console.error("Error fetching professors for report:", error);
    return { success: false, error: "Error al obtener profesores" };
  }
}

export async function getAdminsForReport() {
  try {
    const admins = await prisma.administrador.findMany({
      orderBy: { id_admin: "asc" },
      select: {
        id_admin: true,
        nombre_completo: true,
        correo_electronico: true,
        email_verified: true,
      }
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins for report:", error);
    return { success: false, error: "Error al obtener administradores" };
  }
}

export async function getSummaryForReport() {
  try {
    const estudiantesActivos = await prisma.estudiante.count({ where: { estado: "activo" } });
    const estudiantesInactivos = await prisma.estudiante.count({ where: { estado: { not: "activo" } } });
    const profesoresActivos = await prisma.profesor.count({ where: { estado: "activo" } });
    const totalSolicitudes = await prisma.solicitudCambioContrasena.count();

    return {
      success: true,
      data: {
        estudiantesActivos,
        estudiantesInactivos,
        profesoresActivos,
        totalSolicitudes
      }
    };
  } catch (error) {
    console.error("Error fetching summary for report:", error);
    return { success: false, error: "Error al obtener resumen" };
  }
}
