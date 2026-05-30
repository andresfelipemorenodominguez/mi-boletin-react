"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getGroups() {
  try {
    const groups = await prisma.grupo.findMany({
      include: {
        periodo: true,
      },
      orderBy: { nombre: "asc" },
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

    if (!nombre || !id_periodoStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const id_periodo = parseInt(id_periodoStr, 10);
    if (isNaN(id_periodo)) {
      return { success: false, error: "Período inválido" };
    }

    const newGroup = await prisma.grupo.create({
      data: {
        nombre,
        id_periodo,
      },
      include: {
        periodo: true,
      }
    });

    revalidatePath("/admin/dashboard/groups");
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
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { success: false, error: "Error al eliminar el grupo" };
  }
}
