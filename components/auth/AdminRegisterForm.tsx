"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { registerAdmin } from '@/app/actions/admin';

export function AdminRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await registerAdmin(formData);
      
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res.success && res.email) {
        // Redirigir a la página de verificación pasando el email por query string o simplemente dejándole saber
        router.push(`/admin/email-verification?email=${encodeURIComponent(res.email)}`);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al conectar con el servidor.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert message={error} type="error" />

      <div className="space-y-4">
        <Input
          name="fullname"
          label="Nombre Completo"
          type="text"
          placeholder="Juan Pérez"
          required
          icon={<User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
        />

        <Input
          name="email"
          label="Correo Electrónico"
          type="email"
          placeholder="admin@miboletin.com"
          required
          icon={<Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
        />

        <Input
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
        />

        <Input
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          required
          icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
        />
      </div>

      <Button type="submit" isLoading={isLoading}>
        Crear cuenta
      </Button>
      
      <div className="pt-4 border-t border-white/10 text-center">
        <a href="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">
          ¿Ya tienes una cuenta? Inicia sesión
        </a>
      </div>
    </form>
  );
}
