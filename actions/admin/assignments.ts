"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Asignar Profesor a Grupo + Materia
export async function assignProfessor(formData: FormData) {
  try {
    const id_profesorStr = formData.get("id_profesor") as string;
    const id_grupoStr = formData.get("id_grupo") as string;
    const id_materiaStr = formData.get("id_materia") as string;

    if (!id_profesorStr || !id_grupoStr || !id_materiaStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const id_docente = parseInt(id_profesorStr, 10);
    const id_grupo = parseInt(id_grupoStr, 10);
    const id_materia = parseInt(id_materiaStr, 10);

    // Verificar si ya existe esa asignación
    const existing = await prisma.grupoMateria.findFirst({
      where: {
        id_grupo,
        id_materia,
        id_docente,
      }
    });

    if (existing) {
      return { success: false, error: "Esta asignación ya existe" };
    }

    const assignment = await prisma.grupoMateria.create({
      data: {
        id_grupo,
        id_materia,
        id_docente,
      }
    });

    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: assignment };
  } catch (error) {
    console.error("Error assigning professor:", error);
    return { success: false, error: "Error al realizar la asignación" };
  }
}

// 2. Asignar Estudiante a Grupo
export async function assignStudent(formData: FormData) {
  try {
    const id_estudianteStr = formData.get("id_estudiante") as string;
    const id_grupoStr = formData.get("id_grupo") as string;

    if (!id_estudianteStr || !id_grupoStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const id_estudiante = parseInt(id_estudianteStr, 10);
    const id_grupo = parseInt(id_grupoStr, 10);

    // Verificar si ya está en ese grupo
    const existing = await prisma.grupoEstudiante.findFirst({
      where: {
        id_grupo,
        id_estudiante,
      }
    });

    if (existing) {
      return { success: false, error: "El estudiante ya está matriculado en este grupo" };
    }

    const assignment = await prisma.grupoEstudiante.create({
      data: {
        id_grupo,
        id_estudiante,
      }
    });

    // Actualizar también el campo de texto "grupo" en la tabla Estudiante para consistencia si es necesario
    const grupoInfo = await prisma.grupo.findUnique({ where: { id_grupo } });
    if (grupoInfo) {
      await prisma.estudiante.update({
        where: { id_estudiante },
        data: { grupo: grupoInfo.nombre }
      });
    }

    revalidatePath("/admin/dashboard/assignments");
    revalidatePath("/admin/dashboard/students");
    return { success: true, data: assignment };
  } catch (error) {
    console.error("Error assigning student:", error);
    return { success: false, error: "Error al realizar la matriculación" };
  }
}

// 3. Obtener Historial de Asignaciones (Profesores)
export async function getProfessorAssignments() {
  try {
    const assignments = await prisma.grupoMateria.findMany({
      include: {
        profesor: true,
        grupo: { include: { periodo: true } },
        materia: true,
      },
      orderBy: { id_grupo_materia: 'desc' }
    });
    return { success: true, data: assignments };
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return { success: false, error: "Error al cargar las asignaciones" };
  }
}

// Eliminar Asignación de Profesor
export async function deleteProfessorAssignment(id_grupo_materia: number) {
  try {
    await prisma.grupoMateria.delete({
      where: { id_grupo_materia }
    });
    revalidatePath("/admin/dashboard/assignments");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar la asignación" };
  }
}
