import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo Electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
        role: { label: "Rol", type: "text" },
        identifier: { label: "Identificador (Código)", type: "text" } 
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Faltan credenciales");
        }

        const { email, password, role, identifier } = credentials;

        let user = null;
        let id = 0;
        let name = "";
        let userRole = "";

        if (role === "admin") {
          const admin = await prisma.administrador.findUnique({ where: { correo_electronico: email } });
          if (admin) {
            if (!admin.email_verified) {
              throw new Error("Por favor, verifica tu correo antes de iniciar sesión.");
            }
            if (bcrypt.compareSync(password, admin.contrasena)) {
              user = admin;
              id = admin.id_admin;
              name = admin.nombre_completo;
              userRole = "admin";
            } else {
              throw new Error("Contraseña incorrecta.");
            }
          } else {
            throw new Error("Administrador no encontrado.");
          }
        } else if (role === "profesor") {
          if (!identifier) throw new Error("Falta el identificador del profesor");
          const profesor = await prisma.profesor.findUnique({ where: { correo_electronico: email } });
          if (profesor && profesor.codigo_profesor === identifier && bcrypt.compareSync(password, profesor.contrasena)) {
            user = profesor;
            id = profesor.id_profesor;
            name = profesor.nombre_completo;
            userRole = "profesor";
          } else {
            throw new Error("Credenciales de profesor incorrectas.");
          }
        } else if (role === "estudiante") {
          if (!identifier) throw new Error("Falta el identificador del estudiante");
          const estudiante = await prisma.estudiante.findUnique({ where: { correo_electronico: email } });
          if (estudiante && estudiante.codigo_estudiante === identifier && bcrypt.compareSync(password, estudiante.contrasena)) {
            user = estudiante;
            id = estudiante.id_estudiante;
            name = estudiante.nombre_completo;
            userRole = "estudiante";
          } else {
            throw new Error("Credenciales de estudiante incorrectas.");
          }
        }

        if (user) {
          return {
            id: id.toString(),
            name: name,
            email: email,
            role: userRole,
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirigiremos a nuestra página personalizada luego
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "secreto_super_seguro_para_desarrollo",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
