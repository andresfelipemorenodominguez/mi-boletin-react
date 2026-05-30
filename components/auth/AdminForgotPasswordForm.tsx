"use client";

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { requestPasswordRecovery } from '@/app/actions/admin';

export function AdminForgotPasswordForm() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await requestPasswordRecovery(formData);

      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMessage("Si el correo existe en nuestro sistema, te hemos enviado un enlace para restablecer tu contraseña.");
      }
      setIsLoading(false);
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert message={error} type="error" />
      <Alert message={successMessage} type="success" />

      <div className="space-y-4">
        <Input
          name="email"
          label="Correo Electrónico"
          type="email"
          placeholder="admin@miboletin.com"
          required
          icon={<Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          disabled={!!successMessage}
        />
      </div>

      <Button type="submit" isLoading={isLoading} disabled={!!successMessage}>
        Enviar enlace de recuperación
      </Button>
      
      <div className="pt-4 border-t border-white/10 text-center">
        <a href="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">
          Volver a inicio de sesión
        </a>
      </div>
    </form>
  );
}
