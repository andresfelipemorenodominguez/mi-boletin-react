import { Phone, Mail, MapPin } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Teléfono",
    value: "+57 323 317 5941",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Mail,
    title: "Correo",
    value: "miboletincontac@gmail.com",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: MapPin,
    title: "Dirección",
    value: "Calle 28 # 28 - 48, Colombia",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export function ContactSection() {
  return (
    <section id="contacto" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4 tracking-wider uppercase">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Contáctanos
          </h2>
          <p className="mt-3 text-slate-400">
            Estamos aquí para ayudarte con cualquier consulta.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {CONTACT_INFO.map(({ icon: Icon, title, value, color, bg }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-400">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
