"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getProfessors() {
  try {
    const professors = await prisma.profesor.findMany({
      orderBy: { nombre_completo: "asc" },
      include: {
        grupos_materias: {
          include: {
            materia: true,
            grupo: {
              include: { grado: true }
            }
          }
        }
      }
    });
    return { success: true, data: professors };
  } catch (error) {
    console.error("Error fetching professors:", error);
    return { success: false, error: "Error al cargar los profesores" };
  }
}

export async function createProfessor(formData: FormData) {
  try {
    const nombre_completo = formData.get("nombre_completo") as string;
    const tipo_documento = formData.get("tipo_documento") as string;
    const numero_documento = formData.get("numero_documento") as string;
    const correo_electronico = formData.get("correo_electronico") as string;
    const telefono = formData.get("telefono") as string;
    const contrasena = formData.get("contrasena") as string;

    if (!nombre_completo || !tipo_documento || !numero_documento || !correo_electronico || !contrasena) {
      return { success: false, error: "Todos los campos obligatorios deben estar llenos" };
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const codigo_profesor = `PROF${Date.now().toString().slice(-6)}`;

    const newProfessor = await prisma.profesor.create({
      data: {
        codigo_profesor,
        nombre_completo,
        tipo_documento,
        numero_documento,
        correo_electronico,
        telefono,
        contrasena: hashedPassword,
        estado: "activo",
      },
    });

    revalidatePath("/admin/dashboard/professors");
    return { success: true, data: newProfessor };
  } catch (error: any) {
    console.error("Error creating professor:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "El correo o documento ya está registrado" };
    }
    return { success: false, error: "Error al registrar el profesor" };
  }
}

export async function deleteProfessor(id_profesor: number) {
  try {
    await prisma.profesor.delete({
      where: { id_profesor },
    });
    revalidatePath("/admin/dashboard/professors");
    return { success: true };
  } catch (error) {
    console.error("Error deleting professor:", error);
    return { success: false, error: "Error al eliminar el profesor" };
  }
}

export async function editProfessor(id_profesor: number, formData: FormData) {
  try {
    const nombre_completo = formData.get("nombre_completo") as string;
    const tipo_documento = formData.get("tipo_documento") as string;
    const numero_documento = formData.get("numero_documento") as string;
    const correo_electronico = formData.get("correo_electronico") as string;
    const telefono = formData.get("telefono") as string;
    const contrasena = formData.get("contrasena") as string;

    if (!nombre_completo || !tipo_documento || !numero_documento || !correo_electronico) {
      return { success: false, error: "Todos los campos obligatorios deben estar llenos" };
    }

    const dataToUpdate: any = {
      nombre_completo,
      tipo_documento,
      numero_documento,
      correo_electronico,
      telefono,
    };

    if (contrasena && contrasena.trim() !== "") {
      dataToUpdate.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const updatedProfessor = await prisma.profesor.update({
      where: { id_profesor },
      data: dataToUpdate,
    });

    revalidatePath("/admin/dashboard/professors");
    return { success: true, data: updatedProfessor };
  } catch (error: any) {
    console.error("Error editing professor:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "El correo o documento ya está registrado por otro profesor" };
    }
    return { success: false, error: "Error al editar el profesor" };
  }
}
