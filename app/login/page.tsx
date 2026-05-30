import { BookOpen, GraduationCap, BarChart3, Bell } from "lucide-react";
import { LoginNavbar } from "@/components/login/LoginNavbar";
import { LoginFormCard } from "@/components/login/LoginFormCard";
import { AboutSection } from "@/components/login/AboutSection";
import { FeaturesSection } from "@/components/login/FeaturesSection";
import { TeamSection } from "@/components/login/TeamSection";
import { ContactSection } from "@/components/login/ContactSection";
import { LoginFooter } from "@/components/login/LoginFooter";

const HERO_STATS = [
  { icon: GraduationCap, label: "Estudiantes activos", value: "500+" },
  { icon: BookOpen, label: "Cursos disponibles", value: "40+" },
  { icon: BarChart3, label: "Reportes generados", value: "1.2K+" },
  { icon: Bell, label: "Notificaciones diarias", value: "200+" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <LoginNavbar />

      {/* HERO */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        {/* Background gradient blobs */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-slate-800/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Branding */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Plataforma educativa activa
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">
                  Mi<span className="text-blue-400">Boletín</span>
                </h1>
                <p className="text-xl text-slate-300 font-light leading-relaxed max-w-md">
                  Acceso para Estudiantes y Profesores. Gestiona calificaciones,
                  comunicados y rendimiento académico en un solo lugar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {HERO_STATS.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-white leading-none">
                        {value}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Form */}
            <LoginFormCard />
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturesSection />
      <TeamSection />
      <ContactSection />
      <LoginFooter />
    </div>
  );
}
