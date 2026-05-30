"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { UsersRound, Pencil, Trash2 } from "lucide-react";
import { createGroup, deleteGroup, editGroup } from "@/actions/admin/groups";
import { Grupo, PeriodoAcademico } from "@prisma/client";
import { useRouter } from "next/navigation";

// Extended interface to include the joined 'periodo'
interface GroupWithPeriod extends Grupo {
  periodo: PeriodoAcademico | null;
}

interface GroupViewProps {
  groups: GroupWithPeriod[];
  periods: PeriodoAcademico[];
}

export function GroupView({ groups, periods }: GroupViewProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<GroupWithPeriod | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    id_periodo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await createGroup(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({ nombre: "", id_periodo: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupToEdit) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    const result = await editGroup(groupToEdit.id_grupo, data);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setGroupToEdit(null);
      setFormData({ nombre: "", id_periodo: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error desconocido");
    }
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    setIsSubmitting(true);
    const result = await deleteGroup(groupToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const columns: ColumnDef<GroupWithPeriod>[] = [
    { header: "ID", accessorKey: "id_grupo" },
    { header: "Nombre del Grupo", accessorKey: "nombre" },
    { 
      header: "Período Académico", 
      cell: (item) => item.periodo ? item.periodo.nombre : "Sin período" 
    },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setGroupToEdit(item);
              setFormData({
                nombre: item.nombre,
                id_periodo: item.id_periodo ? String(item.id_periodo) : "",
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
              setGroupToDelete(item.id_grupo);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grupos</h1>
          <p className="text-gray-500 dark:text-gray-400">Crea grupos y asígnalos a un período académico.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <UsersRound className="w-5 h-5" />
          Crear Grupo
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={groups} 
        searchPlaceholder="Buscar por nombre..."
        searchableKeys={["nombre"]}
        itemsPerPage={10}
      />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Grupo">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Grupo *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: 10A" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Período Académico *</label>
              <select required name="id_periodo" value={formData.id_periodo} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona período</option>
                {periods.map(p => (
                  <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar Grupo"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Grupo">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Grupo *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" placeholder="Ej: 10A" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Período Académico *</label>
              <select required name="id_periodo" value={formData.id_periodo} onChange={handleInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona período</option>
                {periods.map(p => (
                  <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                ))}
              </select>
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

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Grupo" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.</p>
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
