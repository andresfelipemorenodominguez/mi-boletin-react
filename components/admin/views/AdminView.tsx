"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { Trash2, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { deleteAdmin } from "@/actions/admin/admins";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AdminViewProps {
  admins: any[];
}

export function AdminView({ admins }: AdminViewProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    setIsSubmitting(true);
    setErrorMsg("");

    const result = await deleteAdmin(adminToDelete);
    setIsSubmitting(false);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error al eliminar el administrador.");
    }
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id_admin" },
    { header: "Nombre Completo", accessorKey: "nombre_completo" },
    { header: "Correo Electrónico", accessorKey: "correo_electronico" },
    { 
      header: "Verificado", 
      cell: (item) => (
        item.email_verified 
          ? <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4"/> Sí</div>
          : <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"><XCircle className="w-4 h-4"/> No</div>
      ) 
    },
    {
      header: "Acciones",
      cell: (item) => (
        <button 
          onClick={() => {
            setAdminToDelete(item.id_admin);
            setIsDeleteModalOpen(true);
          }}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" 
          title="Eliminar Administrador"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administradores</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los administradores del sistema.</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Crear Nuevo Administrador
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            El registro de administradores requiere verificación por correo electrónico por seguridad.
          </p>
        </div>
        <Link 
          href="/admin/register" 
          target="_blank"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium whitespace-nowrap flex items-center gap-2"
        >
          Ir al formulario de registro
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={admins} 
        searchPlaceholder="Buscar administrador..." 
        searchableKeys={["nombre_completo", "correo_electronico"]} 
      />

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Administrador" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            ¿Estás seguro de que deseas eliminar este administrador? Esta acción no se puede deshacer y el usuario perderá acceso al sistema.
          </p>
          {errorMsg && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">{errorMsg}</div>}
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
