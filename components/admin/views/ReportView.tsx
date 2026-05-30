"use client";

import React, { useState } from "react";
import { FileDown, ChartBar, Users, GraduationCap, Shield } from "lucide-react";
import { 
  getStudentsForReport, 
  getProfessorsForReport, 
  getAdminsForReport, 
  getSummaryForReport 
} from "@/actions/admin/reports";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportViewProps {
  initialSummary: {
    estudiantesActivos: number;
    estudiantesInactivos: number;
    profesoresActivos: number;
    totalSolicitudes: number;
  };
}

export function ReportView({ initialSummary }: ReportViewProps) {
  const [gradoFiltro, setGradoFiltro] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFHeader = (doc: jsPDF, title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 51, 102);
    doc.text("MiBoletín Admin", doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleString("es-CO");
    doc.text(`Generado el: ${dateStr}`, doc.internal.pageSize.getWidth() / 2, 22, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 35, { align: "center" });
  };

  const addFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
  };

  const handleEstudiantesPDF = async () => {
    setIsGenerating(true);
    try {
      const result = await getStudentsForReport(gradoFiltro, grupoFiltro);
      if (!result.success || !result.data) throw new Error("No data");

      const doc = new jsPDF();
      let title = "Reporte de Estudiantes";
      if (gradoFiltro) title += ` - Grado: ${gradoFiltro}`;
      if (grupoFiltro) title += ` Grupo: ${grupoFiltro}`;
      
      generatePDFHeader(doc, title);

      const tableData = result.data.map(s => [
        s.codigo_estudiante || "N/A",
        s.nombre_completo,
        s.correo_electronico,
        `${s.grado}-${s.grupo}`,
        s.estado.charAt(0).toUpperCase() + s.estado.slice(1)
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["Código", "Nombre Completo", "Email", "Grado/Grupo", "Estado"]],
        body: tableData,
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        styles: { font: "helvetica", fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 45;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Total Estudiantes: ${result.data.length}`, doc.internal.pageSize.getWidth() - 15, finalY + 10, { align: "right" });

      addFooter(doc);
      doc.save("reporte_estudiantes.pdf");
    } catch (e) {
      alert("Error al generar el reporte");
    }
    setIsGenerating(false);
  };

  const handleProfesoresPDF = async () => {
    setIsGenerating(true);
    try {
      const result = await getProfessorsForReport();
      if (!result.success || !result.data) throw new Error("No data");

      const doc = new jsPDF();
      generatePDFHeader(doc, "Directorio de Profesores");

      const tableData = result.data.map(p => [
        p.codigo_profesor || "N/A",
        p.nombre_completo,
        p.correo_electronico,
        p.telefono || "N/A",
        p.estado.charAt(0).toUpperCase() + p.estado.slice(1)
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["Código", "Nombre Completo", "Email", "Teléfono", "Estado"]],
        body: tableData,
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        styles: { font: "helvetica", fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 45;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Total Profesores: ${result.data.length}`, doc.internal.pageSize.getWidth() - 15, finalY + 10, { align: "right" });

      addFooter(doc);
      doc.save("directorio_profesores.pdf");
    } catch (e) {
      alert("Error al generar el reporte");
    }
    setIsGenerating(false);
  };

  const handleAdminsPDF = async () => {
    setIsGenerating(true);
    try {
      const result = await getAdminsForReport();
      if (!result.success || !result.data) throw new Error("No data");

      const doc = new jsPDF();
      generatePDFHeader(doc, "Directorio de Administradores");

      const tableData = result.data.map(a => [
        a.id_admin.toString(),
        a.nombre_completo,
        a.correo_electronico,
        a.email_verified ? "Sí" : "No"
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["ID", "Nombre Completo", "Correo Electrónico", "Verificado"]],
        body: tableData,
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        styles: { font: "helvetica", fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY || 45;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Total Administradores: ${result.data.length}`, doc.internal.pageSize.getWidth() - 15, finalY + 10, { align: "right" });

      addFooter(doc);
      doc.save("directorio_administradores.pdf");
    } catch (e) {
      alert("Error al generar el reporte");
    }
    setIsGenerating(false);
  };

  const handleResumenPDF = async () => {
    setIsGenerating(true);
    try {
      const result = await getSummaryForReport();
      if (!result.success || !result.data) throw new Error("No data");

      const { estudiantesActivos, estudiantesInactivos, profesoresActivos, totalSolicitudes } = result.data;

      const doc = new jsPDF();
      generatePDFHeader(doc, "Resumen General del Sistema");

      let currentY = 50;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      
      // Estudiantes
      doc.setFillColor(240, 248, 255);
      doc.rect(14, currentY, 182, 10, "F");
      doc.text(" Estadísticas de Estudiantes", 15, currentY + 7);
      currentY += 15;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(` Estudiantes Activos: ${estudiantesActivos}`, 15, currentY);
      currentY += 8;
      doc.text(` Estudiantes Inactivos: ${estudiantesInactivos}`, 15, currentY);
      currentY += 12;

      // Profesores
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(240, 248, 255);
      doc.rect(14, currentY, 182, 10, "F");
      doc.text(" Estadísticas de Profesores", 15, currentY + 7);
      currentY += 15;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(` Profesores Activos: ${profesoresActivos}`, 15, currentY);
      currentY += 12;

      // Sistema
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(240, 248, 255);
      doc.rect(14, currentY, 182, 10, "F");
      doc.text(" Soporte y Sistema", 15, currentY + 7);
      currentY += 15;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(` Total de solicitudes de cambio de contraseña: ${totalSolicitudes}`, 15, currentY);

      addFooter(doc);
      doc.save("resumen_sistema.pdf");
    } catch (e) {
      alert("Error al generar el reporte");
    }
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">Centro de Reportes</h1>
          <p className="text-blue-100 mt-2 font-medium text-lg drop-shadow max-w-2xl">
            Visualiza métricas en tiempo real y genera documentos oficiales en formato PDF con la información académica y administrativa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Estadísticas (Ocupa 12 columnas en móviles, 4 en desktop) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <ChartBar className="w-5 h-5" />
              </div>
              Métricas Globales
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-xl border border-blue-100/50 dark:border-gray-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500 text-white rounded-lg shadow-md"><GraduationCap className="w-5 h-5"/></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estudiantes Activos</p>
                </div>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{initialSummary.estudiantesActivos}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-xl border border-purple-100/50 dark:border-gray-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500 text-white rounded-lg shadow-md"><Users className="w-5 h-5"/></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profesores Activos</p>
                </div>
                <p className="text-2xl font-black text-purple-700 dark:text-purple-400">{initialSummary.profesoresActivos}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-500 text-white rounded-lg shadow-md"><GraduationCap className="w-5 h-5"/></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estudiantes Inactivos</p>
                </div>
                <p className="text-2xl font-black text-gray-700 dark:text-gray-300">{initialSummary.estudiantesInactivos}</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-800/50 rounded-xl border border-amber-100/50 dark:border-gray-700/50 transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-lg shadow-md"><Shield className="w-5 h-5"/></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tickets de Soporte</p>
                </div>
                <p className="text-2xl font-black text-amber-700 dark:text-amber-400">{initialSummary.totalSolicitudes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos de Generación de Reportes (Ocupan 8 columnas en desktop) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Reporte Estudiantes */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 flex flex-col justify-between group hover:border-blue-300/50 transition-colors">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reporte de Estudiantes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Genera un documento PDF con la nómina de estudiantes. Utiliza los filtros para obtener listas específicas por grado y grupo.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Filtro Grado</label>
                  <select value={gradoFiltro} onChange={(e) => setGradoFiltro(e.target.value)} className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Todos</option>
                    {[6,7,8,9,10,11].map(g => <option key={g} value={g.toString()}>{g}°</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Filtro Grupo</label>
                  <select value={grupoFiltro} onChange={(e) => setGrupoFiltro(e.target.value)} className="w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow">
                    <option value="">Todos</option>
                    {["A","B","C","D"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={handleEstudiantesPDF} 
              disabled={isGenerating}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileDown className="w-5 h-5" />}
              {isGenerating ? "Procesando..." : "Descargar PDF"}
            </button>
          </div>

          {/* Reporte Profesores */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 flex flex-col justify-between group hover:border-purple-300/50 transition-colors">
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Directorio Docente</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Descarga el directorio completo del personal docente activo, incluyendo datos de contacto e identificación oficial.</p>
            </div>
            <button 
              onClick={handleProfesoresPDF} 
              disabled={isGenerating}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileDown className="w-5 h-5" />}
              {isGenerating ? "Procesando..." : "Descargar PDF"}
            </button>
          </div>

          {/* Reporte Administradores */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 flex flex-col justify-between group hover:border-slate-300/50 transition-colors">
            <div>
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Directorio Administrativo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Obtén la lista de usuarios con privilegios de administración y su estado de verificación de seguridad.</p>
            </div>
            <button 
              onClick={handleAdminsPDF} 
              disabled={isGenerating}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl hover:from-slate-800 hover:to-black transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileDown className="w-5 h-5" />}
              {isGenerating ? "Procesando..." : "Descargar PDF"}
            </button>
          </div>

          {/* Reporte Resumen */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 flex flex-col justify-between group hover:border-emerald-300/50 transition-colors">
            <div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ChartBar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Resumen Ejecutivo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">Descarga un informe condensado con los indicadores clave de rendimiento (KPIs) de la plataforma educativa.</p>
            </div>
            <button 
              onClick={handleResumenPDF} 
              disabled={isGenerating}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:transform-none transform hover:-translate-y-0.5"
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileDown className="w-5 h-5" />}
              {isGenerating ? "Procesando..." : "Descargar PDF"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
