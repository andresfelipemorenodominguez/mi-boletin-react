"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGroups() {
  try {
    const groups = await prisma.grupo.findMany({
      include: {
        periodo: true,
        grado: true,
      },
      orderBy: [
        { grado: { nombre: "asc" } },
        { nombre: "asc" }
      ],
    });
    return { success: true, data: groups };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { success: false, error: "Error al cargar los grupos" };
  }
}

export async function createGroup(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const id_periodoStr = formData.get("id_periodo") as string;
    const id_gradoStr = formData.get("id_grado") as string;

    if (!nombre || !id_periodoStr || !id_gradoStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const id_periodo = parseInt(id_periodoStr, 10);
    const id_grado = parseInt(id_gradoStr, 10);

    if (isNaN(id_periodo) || isNaN(id_grado)) {
      return { success: false, error: "Datos inválidos" };
    }

    const newGroup = await prisma.grupo.create({
      data: {
        nombre,
        id_periodo,
        id_grado,
      },
      include: {
        periodo: true,
        grado: true,
      }
    });

    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: newGroup };
  } catch (error) {
    console.error("Error creating group:", error);
    return { success: false, error: "Error al crear el grupo" };
  }
}

export async function deleteGroup(id_grupo: number) {
  try {
    await prisma.grupo.delete({
      where: { id_grupo },
    });
    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { success: false, error: "Error al eliminar el grupo" };
  }
}

export async function editGroup(id_grupo: number, formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const id_periodoStr = formData.get("id_periodo") as string;
    const id_gradoStr = formData.get("id_grado") as string;

    if (!nombre || !id_periodoStr || !id_gradoStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const id_periodo = parseInt(id_periodoStr, 10);
    const id_grado = parseInt(id_gradoStr, 10);

    if (isNaN(id_periodo) || isNaN(id_grado)) {
      return { success: false, error: "Datos inválidos" };
    }

    const updatedGroup = await prisma.grupo.update({
      where: { id_grupo },
      data: {
        nombre,
        id_periodo,
        id_grado,
      },
      include: {
        periodo: true,
        grado: true,
      }
    });

    revalidatePath("/admin/dashboard/groups");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: updatedGroup };
  } catch (error) {
    console.error("Error editing group:", error);
    return { success: false, error: "Error al editar el grupo" };
  }
}

