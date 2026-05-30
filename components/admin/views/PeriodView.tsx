"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { createPeriod, deletePeriod, editPeriod } from "@/actions/admin/periods";
import { PeriodoAcademico } from "@prisma/client";
import { useRouter } from "next/navigation";

interface PeriodViewProps {
  periods: PeriodoAcademico[];
}

export function PeriodView({ periods }: PeriodViewProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [periodToEdit, setPeriodToEdit] = useState<PeriodoAcademico | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    inicio: "",
    fin: "",
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

    const result = await createPeriod(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({ nombre: "", inicio: "", fin: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodToEdit) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await editPeriod(periodToEdit.id_periodo, data);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setPeriodToEdit(null);
      setFormData({ nombre: "", inicio: "", fin: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const confirmDelete = async () => {
    if (!periodToDelete) return;
    setIsSubmitting(true);
    const result = await deletePeriod(periodToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setPeriodToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const columns: ColumnDef<PeriodoAcademico>[] = [
    { header: "ID", accessorKey: "id_periodo" },
    { header: "Nombre", accessorKey: "nombre" },
    { 
      header: "Fecha Inicio", 
      cell: (item) => new Date(item.fecha_inicio).toLocaleDateString("es-ES") 
    },
    { 
      header: "Fecha Fin", 
      cell: (item) => new Date(item.fecha_fin).toLocaleDateString("es-ES") 
    },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setPeriodToEdit(item);
              setFormData({
                nombre: item.nombre,
                inicio: new Date(item.fecha_inicio).toISOString().split('T')[0],
                fin: new Date(item.fecha_fin).toISOString().split('T')[0],
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
              setPeriodToDelete(item.id_periodo);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Períodos Académicos</h1>
          <p className="text-gray-500 dark:text-gray-400">Crea y gestiona los períodos del año escolar.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <CalendarDays className="w-5 h-5" />
          Crear Período
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={periods} 
        searchPlaceholder="Buscar por nombre..." 
        searchableKeys={["nombre"]} 
        itemsPerPage={10}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Período">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Período *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: 2026-1" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Inicio *</label>
                <input required name="inicio" value={formData.inicio} onChange={handleInputChange} type="date" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Fin *</label>
                <input required name="fin" value={formData.fin} onChange={handleInputChange} type="date" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Período"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Período">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Período *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: 2026-1" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Inicio *</label>
                <input required name="inicio" value={formData.inicio} onChange={handleInputChange} type="date" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Fin *</label>
                <input required name="fin" value={formData.fin} onChange={handleInputChange} type="date" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Período" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este período? Esta acción no se puede deshacer.</p>
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
