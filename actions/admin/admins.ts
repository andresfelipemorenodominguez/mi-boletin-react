"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdmins() {
  try {
    const admins = await prisma.administrador.findMany({
      orderBy: { id_admin: "asc" },
      select: {
        id_admin: true,
        nombre_completo: true,
        correo_electronico: true,
        email_verified: true,
      }
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return { success: false, error: "Error al cargar los administradores" };
  }
}

export async function deleteAdmin(id_admin: number) {
  try {
    // Evitar que el admin se elimine a sí mismo (esto requeriría el ID en sesión,
    // pero por ahora podemos simplemente dejar que la vista lo bloquee si es posible).
    // Asumimos que la base de datos permite la eliminación si no hay dependencias restrictivas.
    await prisma.administrador.delete({
      where: { id_admin }
    });
    revalidatePath("/admin/dashboard/admins");
    return { success: true };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { success: false, error: "Error al eliminar el administrador. Puede tener dependencias asociadas." };
  }
}
