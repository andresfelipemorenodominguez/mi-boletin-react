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
        role: { label: "Rol", type: "text" } 
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Faltan credenciales");
        }

        const { email, password, role } = credentials;

        let user = null;
        let id = 0;
        let name = "";
        let userRole = "";

        if (role === "admin") {
          const admin = await prisma.administrador.findUnique({ where: { correo_electronico: email } });
          if (admin && bcrypt.compareSync(password, admin.contrasena)) {
            user = admin;
            id = admin.id_admin;
            name = admin.nombre_completo;
            userRole = "admin";
          }
        } else if (role === "profesor") {
          const profesor = await prisma.profesor.findUnique({ where: { correo_electronico: email } });
          if (profesor && bcrypt.compareSync(password, profesor.contrasena)) {
            user = profesor;
            id = profesor.id_profesor;
            name = profesor.nombre_completo;
            userRole = "profesor";
          }
        } else if (role === "estudiante") {
          const estudiante = await prisma.estudiante.findUnique({ where: { correo_electronico: email } });
          if (estudiante && bcrypt.compareSync(password, estudiante.contrasena)) {
            user = estudiante;
            id = estudiante.id_estudiante;
            name = estudiante.nombre_completo;
            userRole = "estudiante";
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

        return null; // Login fallido
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
