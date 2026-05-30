import { Users, Lightbulb, Shield } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Users,
    text: "Diseñada para todos los miembros de la comunidad educativa.",
  },
  {
    icon: Lightbulb,
    text: "Desarrollo continuo para mejorar cada experiencia de aprendizaje.",
  },
  {
    icon: Shield,
    text: "Compromiso con la protección y privacidad de la información.",
  },
];

export function AboutSection() {
  return (
    <section id="acerca" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4 tracking-wider uppercase">
            Acerca de Nosotros
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tecnología que impulsa el aprendizaje
          </h2>
          <p className="mt-4 text-slate-400 text-lg leading-relaxed">
            Somos una plataforma creada para acompañar y fortalecer los procesos
            educativos mediante herramientas digitales intuitivas, seguras y
            accesibles.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
