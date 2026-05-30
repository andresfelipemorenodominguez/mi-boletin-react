import { CalendarDays, MessageSquare, BarChart3, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Calendario Académico",
    description: "Consulta fechas importantes como exámenes y entregas.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: MessageSquare,
    title: "Comunicación Directa",
    description: "Los profesores envían observaciones directamente a los estudiantes.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/30",
  },
  {
    icon: BarChart3,
    title: "Reportes Detallados",
    description: "Genera reportes personalizados del rendimiento académico.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "group-hover:border-violet-500/30",
  },
  {
    icon: Zap,
    title: "Tiempo Real",
    description: "Actualización instantánea de calificaciones y novedades.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/30",
  },
];

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4 tracking-wider uppercase">
            Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            ¿Por qué elegir nuestra plataforma?
          </h2>
          <p className="mt-3 text-slate-400">
            Herramientas pensadas para simplificar la gestión educativa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color, bg, border }) => (
            <div
              key={title}
              className={`group p-6 rounded-2xl bg-slate-800/50 border border-white/5 ${border} hover:bg-slate-800 transition-all duration-300`}
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
