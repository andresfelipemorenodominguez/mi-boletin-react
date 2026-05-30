import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AdminForgotPasswordForm } from '@/components/auth/AdminForgotPasswordForm';
import { KeyRound } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Te enviaremos instrucciones a tu correo"
      icon={<KeyRound className="text-white w-8 h-8" />}
    >
      <AdminForgotPasswordForm />
    </AuthLayout>
  );
}
