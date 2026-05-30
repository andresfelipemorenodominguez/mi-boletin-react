"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  try {
    const [studentsCount, professorsCount, groupsCount, subjectsCount] = await Promise.all([
      prisma.estudiante.count({ where: { estado: "activo" } }),
      prisma.profesor.count({ where: { estado: "activo" } }),
      prisma.grupo.count(),
      prisma.materia.count(),
    ]);

    return {
      success: true,
      data: {
        students: studentsCount,
        professors: professorsCount,
        groups: groupsCount,
        subjects: subjectsCount,
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Error al cargar las estadísticas" };
  }
}
