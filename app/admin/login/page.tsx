import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <AuthLayout 
      title="Acceso Administrativo" 
      subtitle="Inicia sesión para gestionar Mi Boletín"
      icon={<ShieldAlert className="text-white w-8 h-8" />}
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
