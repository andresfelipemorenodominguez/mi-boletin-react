"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "./AdminContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UsersRound,
  BookOpen,
  Link as LinkIcon,
  CalendarDays,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  LogOut,
  Settings,
  ChevronRight,
  Newspaper
} from "lucide-react";

const navigationLinks = [
  {
    section: "General",
    items: [{ name: "Inicio", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Gestión",
    items: [
      { name: "Estudiantes", href: "/admin/dashboard/students", icon: Users },
      { name: "Profesores", href: "/admin/dashboard/professors", icon: GraduationCap },
      { name: "Grupos", href: "/admin/dashboard/groups", icon: UsersRound },
      { name: "Materias", href: "/admin/dashboard/subjects", icon: BookOpen },
      { name: "Asignaciones", href: "/admin/dashboard/assignments", icon: LinkIcon },
    ],
  },
  {
    section: "Configuración",
    items: [
      { name: "Períodos", href: "/admin/dashboard/periods", icon: CalendarDays },
      { name: "Administradores", href: "/admin/dashboard/admins", icon: ShieldCheck },
    ],
  },
  {
    section: "Comunicación",
    items: [{ name: "Chat", href: "/admin/dashboard/chat", icon: MessageSquare }],
  },
  {
    section: "Reportes",
    items: [{ name: "Reportes", href: "/admin/dashboard/reports", icon: BarChart3 }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useAdmin();

  // Mock user for now. Replace with actual session data later
  const userName = "Administrador";
  const userEmail = "admin@miboletin.com";

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header (Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 w-full group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              MiBoletín <span className="text-blue-600 dark:text-blue-500">Admin</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <nav className="space-y-8">
            {navigationLinks.map((group) => (
              <div key={group.section}>
                <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {group.section}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (window.innerWidth < 1024) closeSidebar();
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer (User Profile) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard/profile" onClick={() => { if (window.innerWidth < 1024) closeSidebar(); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-md">
                {userName.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userEmail}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
               <Settings className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
