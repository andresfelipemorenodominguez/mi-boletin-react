import React from 'react';
import { ShieldCheck, Users, BookOpen } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Bienvenido al Panel de Control</h2>
        <p className="text-slate-500 mt-1">Desde aquí podrás gestionar todos los aspectos de la plataforma Mi Boletín.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Usuarios Activos</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Materias</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Estado del Sistema</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">Óptimo</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Acciones Rápidas</h3>
        </div>
        <div className="p-6 flex items-center justify-center h-48 bg-slate-50 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-6">
          El contenido de gestión se implementará en las siguientes fases.
        </div>
      </div>
    </div>
  );
}
