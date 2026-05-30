import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AdminRegisterForm } from '@/components/auth/AdminRegisterForm';
import { UserPlus } from 'lucide-react';

export default function AdminRegisterPage() {
  return (
    <AuthLayout 
      title="Registro de Administrador" 
      subtitle="Crea una cuenta para gestionar la plataforma"
      icon={<UserPlus className="text-white w-8 h-8" />}
    >
      <AdminRegisterForm />
    </AuthLayout>
  );
}
