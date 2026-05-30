"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { updateAdminProfile } from "@/actions/admin/profile";

interface ProfileViewProps {
  admin: {
    nombre_completo: string;
    correo_electronico: string;
  };
}

export function ProfileView({ admin }: ProfileViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: admin.nombre_completo,
    correo: admin.correo_electronico,
    contrasenaActual: "",
    nuevaContrasena: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    const result = await updateAdminProfile(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message || "Perfil actualizado exitosamente");
      setFormData(prev => ({ ...prev, contrasenaActual: "", nuevaContrasena: "" }));
    } else {
      setErrorMsg(result.error || "Ocurrió un error al actualizar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="group relative">
            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-white text-3xl font-bold shadow-inner overflow-hidden transition-all duration-300 group-hover:scale-105">
              {formData.nombre.charAt(0).toUpperCase()}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white/90" />
              </div>
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">Mi Perfil</h1>
            <p className="text-blue-100 mt-1 font-medium text-lg drop-shadow">Gestiona tu información personal y credenciales</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {errorMsg && (
            <div className="p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm flex items-center gap-3 shadow-sm animate-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Datos Personales</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Nombre Completo</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" className="w-full pl-11 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input required name="correo" value={formData.correo} onChange={handleInputChange} type="email" className="w-full pl-11 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Seguridad</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1 flex justify-between items-center">
                    Contraseña Actual
                    <span className="text-xs font-normal text-gray-500">Obligatoria para cambios</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input name="contrasenaActual" value={formData.contrasenaActual} onChange={handleInputChange} type="password" placeholder="••••••••" className="w-full pl-11 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Nueva Contraseña</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      <Shield className="h-5 w-5" />
                    </div>
                    <input name="nuevaContrasena" value={formData.nuevaContrasena} onChange={handleInputChange} type="password" placeholder="Mínimo 8 caracteres" className="w-full pl-11 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="relative overflow-hidden px-8 py-3.5 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando Cambios...
                  </>
                ) : (
                  <>
                    Guardar Cambios
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
