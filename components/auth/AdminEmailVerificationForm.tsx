"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { verifyAdminEmail } from '@/app/actions/admin';

export function AdminEmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await verifyAdminEmail(email, code);

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res.success) {
        setSuccessMessage("¡Correo verificado con éxito! Redirigiendo al inicio de sesión...");
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
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
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@miboletin.com"
          required
          icon={<Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
          readOnly={!!emailParam}
        />

        <Input
          label="Código de Verificación"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
          maxLength={6}
          className="text-center text-xl tracking-widest"
          icon={<KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />}
        />
      </div>

      <Button type="submit" isLoading={isLoading} disabled={!!successMessage}>
        Verificar Cuenta
      </Button>
      
      <div className="pt-4 border-t border-white/10 text-center">
        <a href="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">
          Volver a inicio de sesión
        </a>
      </div>
    </form>
  );
}
