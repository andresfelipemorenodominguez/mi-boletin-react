"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { UsersRound, Pencil, Trash2, GraduationCap, FolderTree } from "lucide-react";
import { createGroup, deleteGroup, editGroup } from "@/actions/admin/groups";
import { createGrade, deleteGrade, editGrade } from "@/actions/admin/grades";
import { Grupo, PeriodoAcademico, Grado } from "@prisma/client";
import { useRouter } from "next/navigation";

interface GroupWithPeriod extends Grupo {
  periodo: PeriodoAcademico | null;
  grado: Grado | null;
}

interface GroupViewProps {
  groups: GroupWithPeriod[];
  periods: PeriodoAcademico[];
  grades: Grado[];
}

export function GroupView({ groups, periods, grades }: GroupViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"grados" | "grupos">("grados");

  // Modals state
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [gradeToEdit, setGradeToEdit] = useState<Grado | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<GroupWithPeriod | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: "grado" | "grupo", id: number } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [gradeFormData, setGradeFormData] = useState({ nombre: "" });
  const [groupFormData, setGroupFormData] = useState({ nombre: "", id_periodo: "", id_grado: "" });

  const handleGradeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGradeFormData({ ...gradeFormData, [e.target.name]: e.target.value });
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupFormData({ ...groupFormData, [e.target.name]: e.target.value });
  };

  // Grade Submit
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    const data = new FormData();
    data.append("nombre", gradeFormData.nombre);

    const result = gradeToEdit ? await editGrade(gradeToEdit.id_grado, data) : await createGrade(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsGradeModalOpen(false);
      setGradeToEdit(null);
      setGradeFormData({ nombre: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error al guardar el grado");
    }
  };

  // Group Submit
  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    const data = new FormData();
    Object.entries(groupFormData).forEach(([key, value]) => data.append(key, value));

    const result = groupToEdit ? await editGroup(groupToEdit.id_grupo, data) : await createGroup(data);
    setIsSubmitting(false);

    if (result.success) {
      setIsGroupModalOpen(false);
      setGroupToEdit(null);
      setGroupFormData({ nombre: "", id_periodo: "", id_grado: "" });
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error al guardar el grupo");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    const result = itemToDelete.type === "grado" 
      ? await deleteGrade(itemToDelete.id) 
      : await deleteGroup(itemToDelete.id);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar");
    }
  };

  const gradeColumns: ColumnDef<Grado>[] = [
    { header: "ID", accessorKey: "id_grado" },
    { header: "Nombre del Grado", accessorKey: "nombre" },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setGradeToEdit(item);
              setGradeFormData({ nombre: item.nombre });
              setIsGradeModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" 
          ><Pencil className="w-4 h-4" /></button>
          <button 
            onClick={() => {
              setItemToDelete({ type: "grado", id: item.id_grado });
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" 
          ><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  const groupColumns: ColumnDef<GroupWithPeriod>[] = [
    { header: "ID", accessorKey: "id_grupo" },
    { header: "Grupo", accessorKey: "nombre" },
    { header: "Grado", cell: (item) => item.grado ? item.grado.nombre : "Sin grado" },
    { header: "Período", cell: (item) => item.periodo ? item.periodo.nombre : "Sin período" },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setGroupToEdit(item);
              setGroupFormData({
                nombre: item.nombre,
                id_periodo: item.id_periodo ? String(item.id_periodo) : "",
                id_grado: item.id_grado ? String(item.id_grado) : "",
              });
              setIsGroupModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" 
          ><Pencil className="w-4 h-4" /></button>
          <button 
            onClick={() => {
              setItemToDelete({ type: "grupo", id: item.id_grupo });
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" 
          ><Trash2 className="w-4 h-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grados y Grupos</h1>
          <p className="text-gray-500 dark:text-gray-400">Administra los niveles educativos y sus divisiones.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("grados")}
          className={`flex items-center gap-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "grados" 
              ? "border-blue-600 text-blue-600 dark:text-blue-400" 
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Grados
        </button>
        <button
          onClick={() => setActiveTab("grupos")}
          className={`flex items-center gap-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "grupos" 
              ? "border-blue-600 text-blue-600 dark:text-blue-400" 
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <FolderTree className="w-4 h-4" /> Grupos
        </button>
      </div>

      {activeTab === "grados" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={() => { setGradeToEdit(null); setGradeFormData({ nombre: "" }); setIsGradeModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <GraduationCap className="w-5 h-5" /> Crear Grado
            </button>
          </div>
          <DataTable columns={gradeColumns} data={grades} searchPlaceholder="Buscar grado..." searchableKeys={["nombre"]} itemsPerPage={10} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={() => { setGroupToEdit(null); setGroupFormData({ nombre: "", id_periodo: "", id_grado: "" }); setIsGroupModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <UsersRound className="w-5 h-5" /> Crear Grupo
            </button>
          </div>
          <DataTable columns={groupColumns} data={groups} searchPlaceholder="Buscar grupo..." searchableKeys={["nombre"]} itemsPerPage={10} />
        </div>
      )}

      {/* Grade Modal */}
      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title={gradeToEdit ? "Editar Grado" : "Crear Nuevo Grado"}>
        <form onSubmit={handleGradeSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Grado *</label>
              <input required name="nombre" value={gradeFormData.nombre} onChange={handleGradeInputChange} type="text" placeholder="Ej: Sexto" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsGradeModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">{isSubmitting ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </Modal>

      {/* Group Modal */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title={groupToEdit ? "Editar Grupo" : "Crear Nuevo Grupo"}>
        <form onSubmit={handleGroupSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Grado *</label>
              <select required name="id_grado" value={groupFormData.id_grado} onChange={handleGroupInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grado</option>
                {grades.map(g => (
                  <option key={g.id_grado} value={g.id_grado}>{g.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre (Letra/Número) *</label>
              <input required name="nombre" value={groupFormData.nombre} onChange={handleGroupInputChange} type="text" placeholder="Ej: A" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período Académico *</label>
              <select required name="id_periodo" value={groupFormData.id_periodo} onChange={handleGroupInputChange} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona período</option>
                {periods.map(p => (
                  <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsGroupModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">{isSubmitting ? "Guardando..." : "Guardar"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Eliminación" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer y puede afectar registros relacionados.</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
            <button onClick={confirmDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg">{isSubmitting ? "Eliminando..." : "Eliminar"}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
