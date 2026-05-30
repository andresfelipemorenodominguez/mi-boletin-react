"use client";

import React from "react";
import { MessageSquare, Search, Send, User } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-300">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Interno</h1>
        <p className="text-gray-500 dark:text-gray-400">Comunícate con profesores y otros administradores.</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar contacto..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Mock Contact */}
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors text-left group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Juan Pérez (Profesor)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">En línea</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors text-left group bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">María López (Admin)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Desconectada</p>
              </div>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">María López (Admin)</h2>
                <p className="text-xs text-gray-500">Última vez hoy a las 10:30 AM</p>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30 dark:bg-gray-900/30">
            <div className="flex justify-center">
              <span className="text-xs text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                Hoy
              </span>
            </div>
            
            <div className="flex items-end gap-2 max-w-lg">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex-shrink-0 flex items-center justify-center text-purple-600">
                <User className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                <p className="text-sm text-gray-700 dark:text-gray-300">Hola, ¿podrías revisar los reportes de este período?</p>
                <p className="text-[10px] text-gray-400 mt-1">10:28 AM</p>
              </div>
            </div>

            <div className="flex items-end gap-2 max-w-lg ml-auto flex-row-reverse">
              <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-br-sm shadow-sm">
                <p className="text-sm">¡Claro! En un momento los reviso y te comento.</p>
                <p className="text-[10px] text-blue-200 mt-1 text-right">10:30 AM</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
