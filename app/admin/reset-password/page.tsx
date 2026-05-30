import React, { Suspense } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AdminResetPasswordForm } from '@/components/auth/AdminResetPasswordForm';
import { LockKeyhole } from 'lucide-react';

export default function AdminResetPasswordPage() {
  return (
    <AuthLayout 
      title="Restablecer Contraseña" 
      subtitle="Ingresa tu nueva contraseña"
      icon={<LockKeyhole className="text-white w-8 h-8" />}
    >
      <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
        <AdminResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
