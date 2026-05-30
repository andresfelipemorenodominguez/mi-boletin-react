import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const newAdmin = await prisma.administrador.create({
      data: {
        nombre_completo: "Test Admin",
        correo_electronico: "testadmin@test.com",
        contrasena: "hashedpassword123",
        verification_code: "123456",
        verification_code_expires: new Date(),
        email_verified: false,
      },
    });
    console.log("Admin created successfully:", newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

main();
