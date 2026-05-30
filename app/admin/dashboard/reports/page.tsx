"use client";

import React from "react";
import { BarChart3, FileText, Download, Users, GraduationCap, ShieldCheck } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h1>
          <p className="text-gray-500 dark:text-gray-400">Consulta estadísticas y descarga reportes en PDF.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reporte Estudiantes */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reporte de Estudiantes</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Descarga la lista completa de estudiantes matriculados. Puedes aplicar filtros por grado y grupo antes de generar el PDF.</p>
          
          <div className="space-y-3 mb-6">
            <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
              <option value="">Todos los grados</option>
              <option value="6">6°</option>
              <option value="7">7°</option>
              <option value="11">11°</option>
            </select>
            <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
              <option value="">Todos los grupos</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>

        {/* Reporte Profesores */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-green-500/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <FileText className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reporte de Profesores</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Descarga el directorio completo de profesores activos en el sistema, incluyendo sus datos de contacto y asignaturas.</p>
          
          <div className="mt-auto pt-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Reporte Administradores */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-purple-500/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <FileText className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reporte de Administradores</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Descarga el listado de administradores registrados en el sistema y su estado de verificación.</p>
          
          <div className="mt-auto pt-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Resumen Global */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-orange-500/50 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <FileText className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Resumen General</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Genera un documento PDF con las métricas y estadísticas globales del sistema actual.</p>
          
          <div className="mt-auto pt-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium">
              <Download className="w-4 h-4" />
              Descargar Resumen PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
