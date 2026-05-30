"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { UserPlus, Pencil, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { createStudent, deleteStudent, editStudent } from "@/actions/admin/students";
import { Estudiante } from "@prisma/client";
import { useRouter } from "next/navigation";

interface StudentViewProps {
  students: Estudiante[];
}

export function StudentView({ students }: StudentViewProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Estudiante | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombre_completo: "",
    tipo_documento: "",
    numero_documento: "",
    correo_electronico: "",
    grado: "",
    grupo: "",
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

    const result = await createStudent(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({
        nombre_completo: "", tipo_documento: "", numero_documento: "",
        correo_electronico: "", grado: "", grupo: "", contrasena: "",
      });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await editStudent(studentToEdit.id_estudiante, data);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setStudentToEdit(null);
      setFormData({
        nombre_completo: "", tipo_documento: "", numero_documento: "",
        correo_electronico: "", grado: "", grupo: "", contrasena: "",
      });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setIsSubmitting(true);
    const result = await deleteStudent(studentToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const columns: ColumnDef<Estudiante>[] = [
    { header: "Código", accessorKey: "codigo_estudiante" },
    { header: "Nombre", accessorKey: "nombre_completo" },
    { header: "Correo", accessorKey: "correo_electronico" },
    { header: "Grado", accessorKey: "grado" },
    { header: "Grupo", accessorKey: "grupo" },
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
              setStudentToEdit(item);
              setFormData({
                nombre_completo: item.nombre_completo,
                tipo_documento: item.tipo_documento,
                numero_documento: item.numero_documento,
                correo_electronico: item.correo_electronico,
                grado: item.grado,
                grupo: item.grupo,
                contrasena: "", // Password is blank on edit unless changed
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
              setStudentToDelete(item.id_estudiante);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estudiantes</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los estudiantes inscritos en el sistema.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Estudiante
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={students} 
        searchPlaceholder="Buscar por nombre, correo o código..."
        searchableKeys={["nombre_completo", "correo_electronico", "codigo_estudiante"]}
        itemsPerPage={10}
      />

      {/* Modal Crear */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Registrar Nuevo Estudiante">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
              <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Documento *</label>
              <select required name="tipo_documento" value={formData.tipo_documento} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Número de Documento *</label>
              <input required name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
              <input required name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} type="email" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grado *</label>
              <select required name="grado" value={formData.grado} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grado</option>
                <option value="6">6°</option>
                <option value="7">7°</option>
                <option value="8">8°</option>
                <option value="9">9°</option>
                <option value="10">10°</option>
                <option value="11">11°</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grupo *</label>
              <select required name="grupo" value={formData.grupo} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grupo</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Contraseña *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input required name="contrasena" value={formData.contrasena} onChange={handleInputChange} type={showPassword ? "text" : "password"} className="w-full p-2 pr-10 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={handleGeneratePassword} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm font-medium">
                  <RefreshCw className="w-4 h-4" /> Generar
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Estudiante"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Estudiante">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
              <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Documento *</label>
              <select required name="tipo_documento" value={formData.tipo_documento} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Número de Documento *</label>
              <input required name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
              <input required name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} type="email" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grado *</label>
              <select required name="grado" value={formData.grado} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grado</option>
                <option value="6">6°</option>
                <option value="7">7°</option>
                <option value="8">8°</option>
                <option value="9">9°</option>
                <option value="10">10°</option>
                <option value="11">11°</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grupo *</label>
              <select required name="grupo" value={formData.grupo} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grupo</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">Contraseña (Dejar en blanco para no cambiarla)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input name="contrasena" value={formData.contrasena} onChange={handleInputChange} type={showPassword ? "text" : "password"} className="w-full p-2 pr-10 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={handleGeneratePassword} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm font-medium">
                  <RefreshCw className="w-4 h-4" /> Generar
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Estudiante" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button onClick={confirmDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
