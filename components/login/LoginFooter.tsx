import { BookOpen, Globe, Send, Hash, AtSign } from "lucide-react";

const QUICK_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#acerca", label: "Acerca de" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

const SOCIAL_LINKS = [
  { icon: Globe, href: "#", label: "Sitio Web" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: Hash, href: "#", label: "Redes" },
  { icon: AtSign, href: "#", label: "Correo" },
];

export function LoginFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-10">
          <div className="space-y-4">
            <a href="#inicio" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Mi<span className="text-blue-400">Boletín</span>
              </span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed">
              Promoviendo la innovación digital y la excelencia académica.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-sm text-slate-500">+57 323 317 5941</li>
              <li className="text-sm text-slate-500">miboletincontac@gmail.com</li>
              <li className="text-sm text-slate-500">Calle 28 # 28 - 48, Colombia</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4">
        <p className="text-center text-xs text-slate-600">
          &copy; 2026 MI BOLETÍN. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
