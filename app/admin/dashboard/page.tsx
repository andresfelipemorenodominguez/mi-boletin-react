import React from "react";
import { getDashboardStats } from "@/actions/admin/dashboard";
import { StatCard } from "@/components/admin/ui/StatCard";
import { 
  Users, 
  GraduationCap, 
  UsersRound, 
  BookOpen,
  UserPlus,
  CalendarDays,
  Link as LinkIcon,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const statsResponse = await getDashboardStats();
  
  const stats = statsResponse.success && statsResponse.data ? statsResponse.data : {
    students: 0,
    professors: 0,
    groups: 0,
    subjects: 0,
  };

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-blue-400/20 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bienvenido, Administrador</h1>
          <p className="text-blue-100 max-w-2xl text-lg mb-4">
            Panel de control de MiBoletín. Gestiona estudiantes, profesores, grupos y toda la estructura académica.
          </p>
          <p className="text-sm text-blue-200 font-medium bg-blue-900/30 inline-block px-3 py-1 rounded-full border border-blue-500/30">
            Hoy es {currentDate}
          </p>
        </div>
      </section>

      {/* Overview Stats Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          Resumen General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Estudiantes"
            value={stats.students}
            subtitle="Activos en el sistema"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Profesores"
            value={stats.professors}
            subtitle="Cuerpo docente"
            icon={GraduationCap}
            color="green"
          />
          <StatCard
            title="Grupos"
            value={stats.groups}
            subtitle="Registrados"
            icon={UsersRound}
            color="orange"
          />
          <StatCard
            title="Materias"
            value={stats.subjects}
            subtitle="En el catálogo"
            icon={BookOpen}
            color="purple"
          />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-green-500 rounded-full"></span>
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <QuickActionLink href="/admin/dashboard/students" icon={UserPlus} label="Agregar Estudiante" />
          <QuickActionLink href="/admin/dashboard/professors" icon={GraduationCap} label="Agregar Profesor" />
          <QuickActionLink href="/admin/dashboard/periods" icon={CalendarDays} label="Períodos" />
          <QuickActionLink href="/admin/dashboard/groups" icon={UsersRound} label="Grupos" />
          <QuickActionLink href="/admin/dashboard/subjects" icon={BookOpen} label="Materias" />
          <QuickActionLink href="/admin/dashboard/assignments" icon={LinkIcon} label="Asignaciones" />
        </div>
      </section>
    </div>
  );
}

// Internal component for quick action buttons
function QuickActionLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-gray-800 dark:hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center mb-3 transition-colors">
        <Icon className="w-5 h-5 text-slate-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-gray-300 text-center group-hover:text-blue-700 dark:group-hover:text-blue-400">
        {label}
      </span>
    </Link>
  );
}
