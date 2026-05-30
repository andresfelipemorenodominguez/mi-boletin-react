"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGrades() {
  try {
    const grades = await prisma.grado.findMany({
      orderBy: { nombre: "asc" },
      include: { grupos: true }
    });
    return { success: true, data: grades };
  } catch (error) {
    console.error("Error fetching grades:", error);
    return { success: false, error: "Error al cargar los grados" };
  }
}

export async function createGrade(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    if (!nombre) {
      return { success: false, error: "El nombre es obligatorio" };
    }

    const newGrade = await prisma.grado.create({
      data: { nombre },
    });

    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: newGrade };
  } catch (error: any) {
    console.error("Error creating grade:", error);
    if (error.code === 'P2002') return { success: false, error: "El grado ya existe" };
    return { success: false, error: "Error al crear el grado" };
  }
}

export async function deleteGrade(id_grado: number) {
  try {
    await prisma.grado.delete({
      where: { id_grado },
    });
    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting grade:", error);
    return { success: false, error: "Error al eliminar el grado" };
  }
}

export async function editGrade(id_grado: number, formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    if (!nombre) {
      return { success: false, error: "El nombre es obligatorio" };
    }

    const updatedGrade = await prisma.grado.update({
      where: { id_grado },
      data: { nombre },
    });

    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: updatedGrade };
  } catch (error: any) {
    console.error("Error editing grade:", error);
    if (error.code === 'P2002') return { success: false, error: "El nombre ya está en uso" };
    return { success: false, error: "Error al editar el grado" };
  }
}
