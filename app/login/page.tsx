"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Mail, Lock, KeyRound, ShieldAlert } from "lucide-react";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"estudiante" | "profesor">("estudiante");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        email,
        password,
        role,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(`/${role}/dashboard`); // Asumiendo que esta será la ruta futura
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Mi Boletín" 
      subtitle="Acceso para Estudiantes y Profesores"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert message={error} type="error" />

        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/50 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setRole("estudiante")}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              role === "estudiante" ? "bg-blue-600 text-white shadow-md scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => setRole("profesor")}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              role === "profesor" ? "bg-emerald-600 text-white shadow-md scale-105" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="w-5 h-5" />
            Profesor
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label={role === "estudiante" ? "Código de Estudiante" : "Código de Profesor"}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "estudiante" ? "Ej: EST-001" : "Ej: PROF-001"}
            required
            icon={<KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            icon={<Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          />
        </div>

        <Button type="submit" isLoading={isLoading} variant={role === "estudiante" ? "primary" : "secondary"}>
          Ingresar al sistema
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-700">
        <a 
          href="/admin/login" 
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 hover:border-slate-600"
        >
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          Acceso Administrativo
        </a>
      </div>
    </AuthLayout>
  );
}
