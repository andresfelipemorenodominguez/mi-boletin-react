"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { UserPlus, Pencil, Trash2 } from "lucide-react";

// Mock interface
interface Student {
  id: string;
  codigo: string;
  nombre: string;
  correo: string;
  grado: string;
  grupo: string;
  estado: "Activo" | "Inactivo";
}

// Mock Data
const mockStudents: Student[] = [
  { id: "1", codigo: "EST001", nombre: "Ana Gómez", correo: "ana@ejemplo.com", grado: "10°", grupo: "A", estado: "Activo" },
  { id: "2", codigo: "EST002", nombre: "Carlos Pérez", correo: "carlos@ejemplo.com", grado: "11°", grupo: "B", estado: "Activo" },
  { id: "3", codigo: "EST003", nombre: "María Rodriguez", correo: "maria@ejemplo.com", grado: "9°", grupo: "A", estado: "Inactivo" },
  { id: "4", codigo: "EST004", nombre: "Juan Felipe", correo: "juan@ejemplo.com", grado: "10°", grupo: "C", estado: "Activo" },
  { id: "5", codigo: "EST005", nombre: "Laura Martinez", correo: "laura@ejemplo.com", grado: "8°", grupo: "A", estado: "Activo" },
];

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDef<Student>[] = [
    { header: "Código", accessorKey: "codigo" },
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Correo", accessorKey: "correo" },
    { header: "Grado", accessorKey: "grado" },
    { header: "Grupo", accessorKey: "grupo" },
    { 
      header: "Estado", 
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === "Activo" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {item.estado}
        </span>
      )
    },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estudiantes</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los estudiantes inscritos en el sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Agregar Estudiante
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={mockStudents} 
        searchPlaceholder="Buscar por nombre, correo o código..."
        searchableKeys={["nombre", "correo", "codigo"]}
        itemsPerPage={10}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nuevo Estudiante"
      >
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">
            Formulario de registro en construcción (Fase 3).
          </p>
          {/* Placeholder for the form */}
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            Formulario
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium">
              Guardar Estudiante
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
