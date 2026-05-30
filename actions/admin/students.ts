"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getStudents() {
  try {
    const students = await prisma.estudiante.findMany({
      include: {
        grupo: {
          include: {
            grado: true
          }
        }
      },
      orderBy: { nombre_completo: "asc" },
    });
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Error al cargar los estudiantes" };
  }
}

export async function createStudent(formData: FormData) {
  try {
    const nombre_completo = formData.get("nombre_completo") as string;
    const tipo_documento = formData.get("tipo_documento") as string;
    const numero_documento = formData.get("numero_documento") as string;
    const correo_electronico = formData.get("correo_electronico") as string;
    const id_grupoStr = formData.get("id_grupo") as string;
    const contrasena = formData.get("contrasena") as string;

    if (!nombre_completo || !tipo_documento || !numero_documento || !correo_electronico || !id_grupoStr || !contrasena) {
      return { success: false, error: "Todos los campos obligatorios deben estar llenos" };
    }

    const id_grupo = parseInt(id_grupoStr, 10);
    if (isNaN(id_grupo)) return { success: false, error: "Grupo inválido" };

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const codigo_estudiante = `EST${Date.now().toString().slice(-6)}`;

    const newStudent = await prisma.estudiante.create({
      data: {
        codigo_estudiante,
        nombre_completo,
        tipo_documento,
        numero_documento,
        correo_electronico,
        id_grupo,
        contrasena: hashedPassword,
        estado: "activo",
      },
      include: {
        grupo: {
          include: { grado: true }
        }
      }
    });

    revalidatePath("/admin/dashboard/students");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: newStudent };
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "El correo o documento ya está registrado" };
    }
    return { success: false, error: "Error al registrar el estudiante" };
  }
}

export async function deleteStudent(id_estudiante: number) {
  try {
    await prisma.estudiante.delete({
      where: { id_estudiante },
    });
    revalidatePath("/admin/dashboard/students");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Error al eliminar el estudiante" };
  }
}

export async function editStudent(id_estudiante: number, formData: FormData) {
  try {
    const nombre_completo = formData.get("nombre_completo") as string;
    const tipo_documento = formData.get("tipo_documento") as string;
    const numero_documento = formData.get("numero_documento") as string;
    const correo_electronico = formData.get("correo_electronico") as string;
    const id_grupoStr = formData.get("id_grupo") as string;
    const contrasena = formData.get("contrasena") as string; 

    if (!nombre_completo || !tipo_documento || !numero_documento || !correo_electronico || !id_grupoStr) {
      return { success: false, error: "Todos los campos (excepto contraseña) son obligatorios" };
    }

    const id_grupo = parseInt(id_grupoStr, 10);
    if (isNaN(id_grupo)) return { success: false, error: "Grupo inválido" };

    const dataToUpdate: any = {
      nombre_completo,
      tipo_documento,
      numero_documento,
      correo_electronico,
      id_grupo,
    };

    if (contrasena && contrasena.trim() !== "") {
      dataToUpdate.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const updatedStudent = await prisma.estudiante.update({
      where: { id_estudiante },
      data: dataToUpdate,
      include: {
        grupo: {
          include: { grado: true }
        }
      }
    });

    revalidatePath("/admin/dashboard/students");
    revalidatePath("/admin/dashboard/assignments");
    return { success: true, data: updatedStudent };
  } catch (error: any) {
    console.error("Error editing student:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "El correo o documento ya está registrado por otro estudiante" };
    }
    return { success: false, error: "Error al editar el estudiante" };
  }
}
