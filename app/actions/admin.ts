"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, sendRecoveryEmail } from "@/lib/mail";

// Utilidad para generar códigos
function generateCode(length = 6) {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerAdmin(formData: FormData) {
  const fullname = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullname || !email || !password) {
    return { error: "Todos los campos son requeridos." };
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.administrador.findUnique({
      where: { correo_electronico: email },
    });

    if (existingUser) {
      return { error: "Este correo electrónico ya está registrado." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    // Expira en 15 minutos
    const expires = new Date(Date.now() + 15 * 60000);

    const newAdmin = await prisma.administrador.create({
      data: {
        nombre_completo: fullname,
        correo_electronico: email,
        contrasena: hashedPassword,
        verification_code: verificationCode,
        verification_code_expires: expires,
        email_verified: false,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    return { success: true, email: newAdmin.correo_electronico };
  } catch (error) {
    console.error("Error registrando administrador:", error);
    return { error: "Error en el servidor al registrar el administrador." };
  }
}

export async function verifyAdminEmail(email: string, code: string) {
  if (!email || !code) {
    return { error: "Correo y código son requeridos." };
  }

  try {
    const admin = await prisma.administrador.findUnique({
      where: { correo_electronico: email },
    });

    if (!admin) {
      return { error: "Usuario no encontrado." };
    }

    if (admin.email_verified) {
      return { success: true, message: "El correo ya estaba verificado." };
    }

    if (admin.verification_code !== code) {
      return { error: "Código de verificación inválido." };
    }

    if (admin.verification_code_expires && new Date() > admin.verification_code_expires) {
      return { error: "El código de verificación ha expirado." };
    }

    await prisma.administrador.update({
      where: { correo_electronico: email },
      data: {
        email_verified: true,
        verification_code: null,
        verification_code_expires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error verificando correo:", error);
    return { error: "Error en el servidor al verificar el correo." };
  }
}

export async function requestPasswordRecovery(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { error: "El correo es requerido." };

  try {
    const admin = await prisma.administrador.findUnique({
      where: { correo_electronico: email },
    });

    if (!admin) {
      // Por seguridad, no revelamos si el correo existe o no
      return { success: true };
    }

    const recoveryToken = generateCode(32); // Token más largo para seguridad
    const expires = new Date(Date.now() + 24 * 60 * 60000); // 24 horas

    await prisma.administrador.update({
      where: { correo_electronico: email },
      data: {
        recovery_token: recoveryToken,
        recovery_token_expires: expires,
      },
    });

    await sendRecoveryEmail(email, recoveryToken, admin.nombre_completo);

    return { success: true };
  } catch (error) {
    console.error("Error solicitando recuperación:", error);
    return { error: "Error en el servidor." };
  }
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("password") as string;

  if (!token || !newPassword) return { error: "Faltan datos." };

  try {
    const admin = await prisma.administrador.findFirst({
      where: {
        recovery_token: token,
      },
    });

    if (!admin) return { error: "Enlace inválido o expirado." };

    if (admin.recovery_token_expires && new Date() > admin.recovery_token_expires) {
      return { error: "El enlace ha expirado. Por favor solicita uno nuevo." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.administrador.update({
      where: { id_admin: admin.id_admin },
      data: {
        contrasena: hashedPassword,
        recovery_token: null,
        recovery_token_expires: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error restableciendo contraseña:", error);
    return { error: "Error en el servidor." };
  }
}
