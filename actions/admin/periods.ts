"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPeriods() {
  try {
    const periods = await prisma.periodoAcademico.findMany({
      orderBy: { fecha_inicio: "desc" },
    });
    return { success: true, data: periods };
  } catch (error) {
    console.error("Error fetching periods:", error);
    return { success: false, error: "Error al cargar los períodos" };
  }
}

export async function createPeriod(formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const inicioStr = formData.get("inicio") as string;
    const finStr = formData.get("fin") as string;

    if (!nombre || !inicioStr || !finStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const fecha_inicio = new Date(inicioStr);
    const fecha_fin = new Date(finStr);

    if (isNaN(fecha_inicio.getTime()) || isNaN(fecha_fin.getTime())) {
       return { success: false, error: "Fechas inválidas" };
    }

    const newPeriod = await prisma.periodoAcademico.create({
      data: {
        nombre,
        fecha_inicio,
        fecha_fin,
      },
    });

    revalidatePath("/admin/dashboard/periods");
    return { success: true, data: newPeriod };
  } catch (error) {
    console.error("Error creating period:", error);
    return { success: false, error: "Error al crear el período" };
  }
}

export async function deletePeriod(id_periodo: number) {
  try {
    await prisma.periodoAcademico.delete({
      where: { id_periodo },
    });
    revalidatePath("/admin/dashboard/periods");
    return { success: true };
  } catch (error) {
    console.error("Error deleting period:", error);
    return { success: false, error: "Error al eliminar el período. Puede que tenga grupos asociados." };
  }
}

export async function editPeriod(id_periodo: number, formData: FormData) {
  try {
    const nombre = formData.get("nombre") as string;
    const inicioStr = formData.get("inicio") as string;
    const finStr = formData.get("fin") as string;

    if (!nombre || !inicioStr || !finStr) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    const fecha_inicio = new Date(inicioStr);
    const fecha_fin = new Date(finStr);

    if (isNaN(fecha_inicio.getTime()) || isNaN(fecha_fin.getTime())) {
       return { success: false, error: "Fechas inválidas" };
    }

    const updatedPeriod = await prisma.periodoAcademico.update({
      where: { id_periodo },
      data: {
        nombre,
        fecha_inicio,
        fecha_fin,
      },
    });

    revalidatePath("/admin/dashboard/periods");
    return { success: true, data: updatedPeriod };
  } catch (error) {
    console.error("Error editing period:", error);
    return { success: false, error: "Error al editar el período" };
  }
}
