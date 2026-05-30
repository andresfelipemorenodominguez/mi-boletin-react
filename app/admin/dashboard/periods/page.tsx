"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

interface Period {
  id: string;
  nombre: string;
  inicio: string;
  fin: string;
}

const mockPeriods: Period[] = [
  { id: "1", nombre: "2026-1", inicio: "2026-01-15", fin: "2026-06-15" },
  { id: "2", nombre: "2026-2", inicio: "2026-07-15", fin: "2026-12-10" },
];

export default function PeriodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Period>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Fecha Inicio", accessorKey: "inicio" },
    { header: "Fecha Fin", accessorKey: "fin" },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Períodos Académicos</h1>
          <p className="text-gray-500 dark:text-gray-400">Crea y gestiona los períodos del año escolar.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <CalendarDays className="w-5 h-5" />
          Crear Período
        </button>
      </div>

      <DataTable columns={columns} data={mockPeriods} searchPlaceholder="Buscar por nombre..." searchableKeys={["nombre"]} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Período">
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">Formulario en construcción (Fase 3).</p>
          <div className="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">Formulario</div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium">Guardar Período</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
