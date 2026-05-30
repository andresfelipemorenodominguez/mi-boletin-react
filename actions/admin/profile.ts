"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function updateAdminProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "No autorizado" };
    }

    const email = session.user.email;
    const nombre = formData.get("nombre") as string;
    const nuevoCorreo = formData.get("correo") as string;
    const contrasenaActual = formData.get("contrasenaActual") as string;
    const nuevaContrasena = formData.get("nuevaContrasena") as string;

    if (!nombre || !nuevoCorreo) {
      return { success: false, error: "Nombre y correo son obligatorios" };
    }

    // Buscar admin
    const admin = await prisma.administrador.findUnique({
      where: { correo_electronico: email }
    });

    if (!admin) {
      return { success: false, error: "Administrador no encontrado" };
    }

    const dataToUpdate: any = {
      nombre_completo: nombre,
    };

    // Validar si quiere cambiar correo
    if (nuevoCorreo !== admin.correo_electronico) {
      const existingEmail = await prisma.administrador.findUnique({
        where: { correo_electronico: nuevoCorreo }
      });
      if (existingEmail) {
        return { success: false, error: "El correo ya está en uso" };
      }
      dataToUpdate.correo_electronico = nuevoCorreo;
    }

    // Validar si quiere cambiar contraseña
    if (nuevaContrasena) {
      if (!contrasenaActual) {
        return { success: false, error: "Debes ingresar tu contraseña actual para cambiarla" };
      }
      const isValid = await bcrypt.compare(contrasenaActual, admin.contrasena);
      if (!isValid) {
        return { success: false, error: "La contraseña actual es incorrecta" };
      }
      if (nuevaContrasena.length < 8) {
        return { success: false, error: "La nueva contraseña debe tener al menos 8 caracteres" };
      }
      dataToUpdate.contrasena = await bcrypt.hash(nuevaContrasena, 10);
    }

    await prisma.administrador.update({
      where: { id_admin: admin.id_admin },
      data: dataToUpdate
    });

    revalidatePath("/admin/dashboard/profile");
    return { success: true, message: "Perfil actualizado correctamente. Si cambiaste tu correo, deberás volver a iniciar sesión." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Error al actualizar el perfil" };
  }
}
