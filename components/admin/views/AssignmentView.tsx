"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/admin/ui/DataTable";
import { Modal } from "@/components/admin/ui/Modal";
import { LinkIcon as Presentation, GraduationCap, Link2, Trash2 } from "lucide-react";
import { assignProfessor, assignStudent, deleteProfessorAssignment } from "@/actions/admin/assignments";
import { Profesor, Grupo, Materia, Estudiante } from "@prisma/client";
import { useRouter } from "next/navigation";

// Extend with relations
type ProfessorAssignment = any;

interface AssignmentViewProps {
  professors: Profesor[];
  groups: Grupo[];
  subjects: Materia[];
  students: Estudiante[];
  assignments: ProfessorAssignment[];
}

export function AssignmentView({ professors, groups, subjects, students, assignments }: AssignmentViewProps) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"professors" | "students">("professors");

  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [profFormData, setProfFormData] = useState({ id_profesor: "", id_grupo: "", id_materia: "" });
  const [studentFormData, setStudentFormData] = useState({ id_estudiante: "", id_grupo: "" });

  const handleProfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const data = new FormData();
    Object.entries(profFormData).forEach(([k, v]) => data.append(k, v));

    const result = await assignProfessor(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg("Profesor asignado correctamente");
      setProfFormData({ id_profesor: "", id_grupo: "", id_materia: "" });
      setIsProfModalOpen(false);
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error al asignar");
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const data = new FormData();
    Object.entries(studentFormData).forEach(([k, v]) => data.append(k, v));

    const result = await assignStudent(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg("Estudiante matriculado correctamente");
      setStudentFormData({ id_estudiante: "", id_grupo: "" });
      setIsStudentModalOpen(false);
      router.refresh();
    } else {
      setErrorMsg(result.error || "Error al matricular");
    }
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    setIsSubmitting(true);
    const result = await deleteProfessorAssignment(assignmentToDelete);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar la asignación");
    }
  };

  const profColumns: ColumnDef<ProfessorAssignment>[] = [
    { header: "ID", accessorKey: "id_grupo_materia" },
    { header: "Profesor", cell: (item) => item.profesor?.nombre_completo || "Desconocido" },
    { header: "Grupo", cell: (item) => item.grupo?.nombre || "Desconocido" },
    { header: "Materia", cell: (item) => item.materia?.nombre || "Desconocida" },
    {
      header: "Acciones",
      cell: (item) => (
        <button 
          onClick={() => {
            setAssignmentToDelete(item.id_grupo_materia);
            setIsDeleteModalOpen(true);
          }}
          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" 
          title="Eliminar Asignación"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asignaciones</h1>
          <p className="text-gray-500 dark:text-gray-400">Vincular profesores y estudiantes a los grupos y materias.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("professors")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "professors" 
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" 
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Asignaciones de Profesores
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "students" 
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" 
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Matriculación de Estudiantes
        </button>
      </div>

      {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm mb-4">{successMsg}</div>}

      {activeTab === "professors" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => { setErrorMsg(""); setIsProfModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Presentation className="w-5 h-5" />
              Asignar Profesor a Grupo
            </button>
          </div>
          <DataTable 
            columns={profColumns} 
            data={assignments} 
            searchPlaceholder="Buscar asignación..." 
            searchableKeys={[]} 
            itemsPerPage={10}
          />
        </div>
      )}

      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => { setErrorMsg(""); setIsStudentModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm font-medium"
            >
              <GraduationCap className="w-5 h-5" />
              Matricular Estudiante
            </button>
          </div>
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Matriculación rápida</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Utiliza el botón superior para asignar rápidamente un estudiante existente a un grupo específico. 
              Para ver el listado completo, ve a la sección "Estudiantes" y filtra por la columna "Grupo".
            </p>
          </div>
        </div>
      )}

      {/* Modal Profesor */}
      <Modal isOpen={isProfModalOpen} onClose={() => setIsProfModalOpen(false)} title="Asignar Profesor a Grupo y Materia">
        <form onSubmit={handleProfSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Profesor *</label>
              <select required name="id_profesor" value={profFormData.id_profesor} onChange={(e) => setProfFormData({...profFormData, id_profesor: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona profesor</option>
                {professors.map(p => <option key={p.id_profesor} value={p.id_profesor}>{p.nombre_completo} ({p.codigo_profesor})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grupo *</label>
              <select required name="id_grupo" value={profFormData.id_grupo} onChange={(e) => setProfFormData({...profFormData, id_grupo: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grupo</option>
                {groups.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Materia *</label>
              <select required name="id_materia" value={profFormData.id_materia} onChange={(e) => setProfFormData({...profFormData, id_materia: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona materia</option>
                {subjects.map(s => <option key={s.id_materia} value={s.id_materia}>{s.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsProfModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Asignando..." : "Asignar"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Estudiante */}
      <Modal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} title="Matricular Estudiante">
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{errorMsg}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Estudiante *</label>
              <select required name="id_estudiante" value={studentFormData.id_estudiante} onChange={(e) => setStudentFormData({...studentFormData, id_estudiante: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona estudiante</option>
                {students.map(s => <option key={s.id_estudiante} value={s.id_estudiante}>{s.nombre_completo} ({s.codigo_estudiante})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grupo *</label>
              <select required name="id_grupo" value={studentFormData.id_grupo} onChange={(e) => setStudentFormData({...studentFormData, id_grupo: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <option value="">Selecciona grupo</option>
                {groups.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsStudentModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors font-medium disabled:opacity-50">
              {isSubmitting ? "Matriculando..." : "Matricular"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar Asignacion Prof */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Eliminar Asignación" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar esta asignación de profesor? El profesor ya no tendrá acceso a este grupo/materia.</p>
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
