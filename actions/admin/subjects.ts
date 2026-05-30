"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSubjects() {
  try {
    const subjects = await prisma.materia.findMany({
      orderBy: { nombre: "asc" },
    });
    return { success: true, data: subjects };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return { success: false, error: "Error al cargar las materias" };
  }
}

export async function createSubject(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const codigo = formData.get("codigo") as string;

    if (!nombre) {
      return { success: false, error: "El nombre es obligatorio" };
    }

    const newSubject = await prisma.materia.create({
      data: {
        nombre,
        codigo: codigo || null,
      },
    });

    revalidatePath("/admin/dashboard/subjects");
    return { success: true, data: newSubject };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: "Error al crear la materia (¿Código duplicado?)" };
  }
}

export async function deleteSubject(id_materia: number) {
  try {
    await prisma.materia.delete({
      where: { id_materia },
    });
    revalidatePath("/admin/dashboard/subjects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: "Error al eliminar la materia" };
  }
}
