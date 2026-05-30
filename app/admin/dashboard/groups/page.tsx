"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { UsersRound, Pencil, Trash2 } from "lucide-react";

// Mock interface
interface Group {
  id: string;
  nombre: string;
  periodo: string;
}

// Mock Data
const mockGroups: Group[] = [
  { id: "1", nombre: "10A", periodo: "2026-1" },
  { id: "2", nombre: "10B", periodo: "2026-1" },
  { id: "3", nombre: "11A", periodo: "2026-1" },
];

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Group>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre del Grupo", accessorKey: "nombre" },
    { header: "Período Académico", accessorKey: "periodo" },
    {
      header: "Acciones",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors" title="Editar">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" title="Eliminar">
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
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <UsersRound className="w-5 h-5" />
          Crear Grupo
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={mockGroups} 
        searchPlaceholder="Buscar por nombre o período..."
        searchableKeys={["nombre", "periodo"]}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Grupo">
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">Formulario en construcción (Fase 3).</p>
          <div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">Formulario</div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium">Guardar Grupo</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
