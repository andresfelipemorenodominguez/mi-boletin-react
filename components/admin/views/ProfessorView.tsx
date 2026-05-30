"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { GraduationCap, Pencil, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { createProfessor, deleteProfessor, editProfessor } from "@/actions/admin/professors";
import { useRouter } from "next/navigation";

interface ProfessorViewProps {
  professors: any[]; // Extended Profesor with grupos_materias
}

export function ProfessorView({ professors }: ProfessorViewProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profToEdit, setProfToEdit] = useState<any | null>(null);
  const [profToDelete, setProfToDelete] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombre_completo: "",
    tipo_documento: "",
    numero_documento: "",
    correo_electronico: "",
    telefono: "",
    contrasena: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, contrasena: pass });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await createProfessor(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({
        nombre_completo: "", tipo_documento: "", numero_documento: "",
        correo_electronico: "", telefono: "", contrasena: "",
      });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profToEdit) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await editProfessor(profToEdit.id_profesor, data);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setProfToEdit(null);
      setFormData({
        nombre_completo: "", tipo_documento: "", numero_documento: "",
        correo_electronico: "", telefono: "", contrasena: "",
      });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const confirmDelete = async () => {
    if (!profToDelete) return;
    setIsSubmitting(true);
    const result = await deleteProfessor(profToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setProfToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const columns: ColumnDef<any>[] = [
    { header: "Código", accessorKey: "codigo_profesor" },
    { header: "Nombre", accessorKey: "nombre_completo" },
    { header: "Correo", accessorKey: "correo_electronico" },
    { header: "Teléfono", accessorKey: "telefono" },
    { 
      header: "Asignaciones", 
      cell: (item) => {
        const assignments = item.grupos_materias || [];
        if (assignments.length === 0) return <span className="text-gray-400 italic text-sm">Sin asignaciones</span>;
        
        // Obtenemos los nombres de las materias únicas
        const materiasUnicas = Array.from(new Set(assignments.map((a: any) => a.materia?.nombre)));
        
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{assignments.length} Grupo(s)</span>
            <div className="flex flex-wrap gap-1">
              {materiasUnicas.map((m: any, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs border border-blue-100 dark:border-blue-800">
                  {m}
                </span>
              ))}
            </div>
          </div>
        );
      }
    },
    { 
      header: "Estado", 
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === "activo" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {item.estado === "activo" ? "Activo" : "Inactivo"}
        </span>
      )
    },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setProfToEdit(item);
              setFormData({
                nombre_completo: item.nombre_completo,
                tipo_documento: item.tipo_documento,
                numero_documento: item.numero_documento,
                correo_electronico: item.correo_electronico,
                telefono: item.telefono || "",
                contrasena: "", // Password blank on edit
              });
              setIsEditModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors" 
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setProfToDelete(item.id_profesor);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" 
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profesores</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los profesores registrados en el sistema.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
              nombre_completo: "", tipo_documento: "", numero_documento: "",
              correo_electronico: "", telefono: "", contrasena: "",
            });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <GraduationCap className="w-5 h-5" />
          Agregar Profesor
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={professors} 
        searchPlaceholder="Buscar por nombre o correo..."
        searchableKeys={["nombre_completo", "correo_electronico", "codigo_profesor"]}
        itemsPerPage={10}
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Registrar Nuevo Profesor">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Nombre Completo *</label>
              <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Tipo de Documento *</label>
              <select required name="tipo_documento" value={formData.tipo_documento} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                <option value="">Selecciona tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Número de Documento *</label>
              <input required name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Correo Electrónico *</label>
              <input required name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} type="email" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Contraseña *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input required name="contrasena" value={formData.contrasena} onChange={handleInputChange} type={showPassword ? "text" : "password"} className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={handleGeneratePassword} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600">
                  <RefreshCw className="w-4 h-4" /> Generar
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Profesor"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Profesor">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Nombre Completo *</label>
              <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Tipo de Documento *</label>
              <select required name="tipo_documento" value={formData.tipo_documento} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                <option value="">Selecciona tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Número de Documento *</label>
              <input required name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Correo Electrónico *</label>
              <input required name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} type="email" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Teléfono</label>
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} type="text" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Contraseña (Dejar en blanco para no cambiarla)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input name="contrasena" value={formData.contrasena} onChange={handleInputChange} type={showPassword ? "text" : "password"} className="w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={handleGeneratePassword} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-600">
                  <RefreshCw className="w-4 h-4" /> Generar
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Profesor" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este profesor? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-gray-700">Cancelar</button>
            <button onClick={confirmDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
