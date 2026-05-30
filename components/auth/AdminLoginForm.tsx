"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export function AdminLoginForm() {
  const router = useRouter();
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
        email,
        password,
        role: "admin",
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(`/admin/dashboard`);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert message={error} type="error" />

      <div className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@miboletin.com"
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

      <div className="flex items-center justify-between">
        <a href="/admin/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          ¿Olvidaste tu contraseña?
        </a>
        <a href="/admin/register" className="text-sm text-slate-400 hover:text-white transition-colors">
          Crear cuenta
        </a>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Ingresar al Panel
      </Button>
      
      <div className="pt-4 border-t border-white/10 text-center">
        <a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Volver al portal general
        </a>
      </div>
    </form>
  );
}
