"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, X, Check, CheckCheck, Info, AlertTriangle,
  CheckCircle2, XCircle, Loader2, BellOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Notification {
  id_notificacion: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  href: string | null;
  fecha_creacion: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  info:    { icon: Info,          color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/20" },
  success: { icon: CheckCircle2,  color: "text-green-500",  bg: "bg-green-50 dark:bg-green-900/20" },
  warning: { icon: AlertTriangle, color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/20" },
  error:   { icon: XCircle,       color: "text-red-500",    bg: "bg-red-50 dark:bg-red-900/20" },
};

export function NotificationsDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAsRead(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/admin/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id_notificacion === id ? { ...n, leida: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function deleteNotification(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
    const deleted = notifications.find((n) => n.id_notificacion === id);
    setNotifications((prev) => prev.filter((n) => n.id_notificacion !== id));
    if (deleted && !deleted.leida) setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications/read-all", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
    setUnreadCount(0);
  }

  function handleNotificationClick(n: Notification) {
    if (!n.leida) {
      fetch(`/api/admin/notifications/${n.id_notificacion}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((x) => (x.id_notificacion === n.id_notificacion ? { ...x, leida: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.href) {
      router.push(n.href);
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Leer todas
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sin notificaciones</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Cuando haya actividad nueva aparecerá aquí</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {notifications.map((n) => {
                  const cfg = TYPE_CONFIG[n.tipo] ?? TYPE_CONFIG.info;
                  const Icon = cfg.icon;
                  return (
                    <li
                      key={n.id_notificacion}
                      onClick={() => handleNotificationClick(n)}
                      className={`group flex items-start gap-3 px-4 py-3.5 transition-colors ${
                        n.href ? "cursor-pointer" : "cursor-default"
                      } ${
                        !n.leida
                          ? "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug truncate ${
                            !n.leida
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {n.titulo}
                          </p>
                          {!n.leida && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.mensaje}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(n.fecha_creacion), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.leida && (
                          <button
                            onClick={(e) => markAsRead(n.id_notificacion, e)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(n.id_notificacion, e)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                          title="Eliminar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {notifications.length} notificación{notifications.length !== 1 ? "es" : ""} en total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
