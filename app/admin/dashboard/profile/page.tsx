"use client";

import React from "react";
import { useAdmin } from "@/components/admin/layout/AdminContext";
import { UserCircle, Save, Moon, Sun, Lock } from "lucide-react";

export default function ProfilePage() {
  const { isDarkMode, toggleDarkMode } = useAdmin();
  
  // Mock data
  const userName = "Administrador";
  const userEmail = "admin@miboletin.com";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">Gestiona tu información personal y preferencias.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="flex justify-between items-end mb-8 -mt-12 relative">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-3xl text-white font-bold">
                {userName.charAt(0)}
              </div>
            </div>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center gap-2">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                <UserCircle className="w-5 h-5 text-gray-400" />
                Información Personal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                  <input type="text" defaultValue={userName} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                  <input type="email" defaultValue={userEmail} disabled className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                  <p className="text-xs text-gray-500 mt-1">El correo no puede ser modificado.</p>
                </div>
              </div>
            </div>

            {/* Preferencias y Seguridad */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <Sun className="w-5 h-5 text-gray-400" />
                  Preferencias
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                      {isDarkMode ? <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Modo Oscuro</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Alternar tema visual</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  Seguridad
                </h3>
                <button className="w-full py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium">
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
