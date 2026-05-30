"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { createSubject, deleteSubject, editSubject } from "@/actions/admin/subjects";
import { Materia } from "@prisma/client";
import { useRouter } from "next/navigation";

interface SubjectViewProps {
  subjects: Materia[];
}

export function SubjectView({ subjects }: SubjectViewProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Materia | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await createSubject(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({ nombre: "", codigo: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectToEdit) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await editSubject(subjectToEdit.id_materia, data);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setSubjectToEdit(null);
      setFormData({ nombre: "", codigo: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setIsSubmitting(true);
    const result = await deleteSubject(subjectToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const columns: ColumnDef<Materia>[] = [
    { header: "ID", accessorKey: "id_materia" },
    { header: "Nombre de Materia", accessorKey: "nombre" },
    { header: "Código", accessorKey: "codigo" },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setSubjectToEdit(item);
              setFormData({
                nombre: item.nombre,
                codigo: item.codigo || "",
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
              setSubjectToDelete(item.id_materia);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Materias</h1>
          <p className="text-gray-500 dark:text-gray-400">Crea y gestiona el catálogo de materias.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <BookOpen className="w-5 h-5" />
          Crear Materia
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={subjects} 
        searchPlaceholder="Buscar por nombre o código..." 
        searchableKeys={["nombre", "codigo"]} 
        itemsPerPage={10}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nueva Materia">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Nombre de Materia *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: Matemáticas" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Código (Opcional)</label>
              <input name="codigo" value={formData.codigo} onChange={handleInputChange} type="text" placeholder="Ej: MAT001" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border border-slate-200 dark:border-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Materia"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Materia">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Nombre de Materia *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: Matemáticas" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">Código (Opcional)</label>
              <input name="codigo" value={formData.codigo} onChange={handleInputChange} type="text" placeholder="Ej: MAT001" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" />
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Materia" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.</p>
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
