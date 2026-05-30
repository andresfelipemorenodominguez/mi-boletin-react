"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { resetPassword } from '@/app/actions/admin';

export function AdminResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await resetPassword(formData);

      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMessage("¡Contraseña actualizada con éxito! Redirigiendo...");
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
      setIsLoading(false);
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Alert message="Enlace inválido. Por favor solicita un nuevo enlace de recuperación." type="error" />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert message={error} type="error" />
      <Alert message={successMessage} type="success" />

      <div className="space-y-4">
        <Input
          name="password"
          label="Nueva Contraseña"
          type="password"
          placeholder="••••••••"
          required
          icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          disabled={!!successMessage}
        />

        <Input
          name="confirmPassword"
          label="Confirmar Nueva Contraseña"
          type="password"
          placeholder="••••••••"
          required
          icon={<Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          disabled={!!successMessage}
        />
      </div>

      <Button type="submit" isLoading={isLoading} disabled={!!successMessage}>
        Actualizar contraseña
      </Button>
    </form>
  );
}
