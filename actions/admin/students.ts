"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getStudents() {
  try {
    const students = await prisma.estudiante.findMany({
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
    const grado = formData.get("grado") as string;
    const grupo = formData.get("grupo") as string;
    const contrasena = formData.get("contrasena") as string;

    if (!nombre_completo || !tipo_documento || !numero_documento || !correo_electronico || !grado || !grupo || !contrasena) {
      return { success: false, error: "Todos los campos obligatorios deben estar llenos" };
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    // Generar un código único simple
    const codigo_estudiante = `EST${Date.now().toString().slice(-6)}`;

    const newStudent = await prisma.estudiante.create({
      data: {
        codigo_estudiante,
        nombre_completo,
        tipo_documento,
        numero_documento,
        correo_electronico,
        grado,
        grupo,
        contrasena: hashedPassword,
        estado: "activo",
      },
    });

    revalidatePath("/admin/dashboard/students");
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
    return { success: true };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false, error: "Error al eliminar el estudiante" };
  }
}
