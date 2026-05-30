"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Lock, ShieldAlert, LogIn } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { RoleSelector, Role } from "@/components/login/RoleSelector";
import { PasswordInput } from "@/components/login/PasswordInput";

export function LoginFormCard() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("estudiante");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const accentColor = role === "estudiante" ? "blue" : "emerald";

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
        router.push(`/${role}/dashboard`);
      }
    } catch {
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
          <p className="text-slate-400 text-sm mt-1">Bienvenido a Mi Boletín</p>
        </div>

        <Alert message={error} type="error" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <RoleSelector value={role} onChange={setRole} />

          <Input
            label={role === "estudiante" ? "Código de Estudiante" : "Código de Profesor"}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "estudiante" ? "Ej: EST-001" : "Ej: PROF-001"}
            required
            icon={
              <KeyRound
                className={`h-5 w-5 text-slate-400 group-focus-within:text-${accentColor}-400 transition-colors`}
              />
            }
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
            icon={
              <Mail
                className={`h-5 w-5 text-slate-400 group-focus-within:text-${accentColor}-400 transition-colors`}
              />
            }
          />

          <PasswordInput
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          />

          <div className="flex justify-end">
            <a
              href="/login/solicitud"
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            variant={role === "estudiante" ? "primary" : "secondary"}
            className={
              role === "profesor"
                ? "!bg-emerald-600 hover:!bg-emerald-700 focus:!ring-emerald-500"
                : ""
            }
          >
            <LogIn className="w-4 h-4" />
            Ingresar al sistema
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5">
          <a
            href="/admin/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 hover:text-white transition-all border border-white/5 hover:border-white/10"
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Acceso Administrativo
          </a>
        </div>
      </div>
    </div>
  );
}
