import React from 'react';
import { BookOpen } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle = "Bienvenido al sistema de gestión",
  icon = <BookOpen className="text-white w-8 h-8" />
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            {icon}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-slate-300 mt-2">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
