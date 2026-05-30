"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./AdminContext";
import {
  Menu, Moon, Sun, Bell, Search,
  LayoutDashboard, Users, GraduationCap, UsersRound,
  BookOpen, Link as LinkIcon, CalendarDays, ShieldCheck,
  MessageSquare, BarChart3, UserCircle, LucideIcon,
} from "lucide-react";

interface SearchItem {
  name: string;
  href: string;
  section: string;
  icon: LucideIcon;
  keywords: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  { name: "Inicio", href: "/admin/dashboard", section: "General", icon: LayoutDashboard, keywords: ["inicio", "home", "dashboard"] },
  { name: "Estudiantes", href: "/admin/dashboard/students", section: "Gestión", icon: Users, keywords: ["estudiantes", "alumnos", "students"] },
  { name: "Profesores", href: "/admin/dashboard/professors", section: "Gestión", icon: GraduationCap, keywords: ["profesores", "docentes", "professors"] },
  { name: "Grupos", href: "/admin/dashboard/groups", section: "Gestión", icon: UsersRound, keywords: ["grupos", "grupos", "groups"] },
  { name: "Materias", href: "/admin/dashboard/subjects", section: "Gestión", icon: BookOpen, keywords: ["materias", "asignaturas", "subjects"] },
  { name: "Asignaciones", href: "/admin/dashboard/assignments", section: "Gestión", icon: LinkIcon, keywords: ["asignaciones", "assignments"] },
  { name: "Períodos", href: "/admin/dashboard/periods", section: "Configuración", icon: CalendarDays, keywords: ["periodos", "períodos", "periods"] },
  { name: "Administradores", href: "/admin/dashboard/admins", section: "Configuración", icon: ShieldCheck, keywords: ["administradores", "admins"] },
  { name: "Chat", href: "/admin/dashboard/chat", section: "Comunicación", icon: MessageSquare, keywords: ["chat", "mensajes", "messages"] },
  { name: "Reportes", href: "/admin/dashboard/reports", section: "Reportes", icon: BarChart3, keywords: ["reportes", "reports", "estadisticas"] },
  { name: "Mi Perfil", href: "/admin/dashboard/profile", section: "Cuenta", icon: UserCircle, keywords: ["perfil", "cuenta", "profile"] },
];

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-sm">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function AdminHeader() {
  const { toggleSidebar, isDarkMode, toggleDarkMode } = useAdmin();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? SEARCH_ITEMS.filter((item) =>
        [item.name, item.section, ...item.keywords].some((k) =>
          k.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  useEffect(() => {
    setFocused(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigate(href: string) {
    router.push(href);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused((f) => (f + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused((f) => (f - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigate(results[focused].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div ref={containerRef} className="hidden md:block relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 w-64"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs leading-none"
                tabIndex={-1}
              >
                ✕
              </button>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
              <ul>
                {results.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <button
                        onMouseDown={() => navigate(item.href)}
                        onMouseEnter={() => setFocused(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          i === focused
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          i === focused
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {highlight(item.name, query)}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{item.section}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-xs text-gray-400">
                <span><kbd className="font-sans">↑↓</kbd> navegar</span>
                <span><kbd className="font-sans">↵</kbd> abrir</span>
                <span><kbd className="font-sans">Esc</kbd> cerrar</span>
              </div>
            </div>
          )}

          {open && query.trim() && results.length === 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-6 text-center z-50">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sin resultados para <span className="font-medium text-gray-700 dark:text-gray-200">"{query}"</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Alternar modo oscuro"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
