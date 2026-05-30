import React, { Suspense } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AdminEmailVerificationForm } from '@/components/auth/AdminEmailVerificationForm';
import { MailCheck } from 'lucide-react';

export default function AdminEmailVerificationPage() {
  return (
    <AuthLayout 
      title="Verificar Correo" 
      subtitle="Ingresa el código que hemos enviado a tu correo"
      icon={<MailCheck className="text-white w-8 h-8" />}
    >
      <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
        <AdminEmailVerificationForm />
      </Suspense>
    </AuthLayout>
  );
}
