"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { ShieldCheck, UserPlus, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: string;
  nombre: string;
  correo: string;
  verificado: boolean;
}

const mockAdmins: AdminUser[] = [
  { id: "1", nombre: "Admin Principal", correo: "admin@miboletin.com", verificado: true },
  { id: "2", nombre: "Soporte Técnico", correo: "soporte@miboletin.com", verificado: false },
];

export default function AdminsPage() {
  const columns: ColumnDef<AdminUser>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Correo", accessorKey: "correo" },
    { 
      header: "Estado", 
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.verificado ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {item.verificado ? "Verificado" : "Pendiente"}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administradores</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los usuarios con acceso administrativo.</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5" />
            Crear Nuevo Administrador
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 max-w-xl">
            El registro de nuevos administradores se realiza a través de un flujo seguro que requiere verificación por correo electrónico.
          </p>
        </div>
        <Link 
          href="/admin/register" 
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium whitespace-nowrap"
        >
          Ir al formulario <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <DataTable columns={columns} data={mockAdmins} searchPlaceholder="Buscar administrador..." searchableKeys={["nombre", "correo"]} />
    </div>
  );
}
