import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
  } finally {
    await prisma.$disconnect();
  }
}

main();
