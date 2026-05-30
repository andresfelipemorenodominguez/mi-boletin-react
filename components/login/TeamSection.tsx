const TEAM = [
  { name: "Jesús Aragón", role: "Bases de datos" },
  { name: "Estevan Portilla", role: "Desarrollador Back-End" },
  { name: "José Sánchez", role: "Diseño visual / Front-End" },
  { name: "Andrés Moreno", role: "Desarrollador Back-End" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
];

export function TeamSection() {
  return (
    <section id="equipo" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4 tracking-wider uppercase">
            Equipo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Nuestro Equipo
          </h2>
          <p className="mt-3 text-slate-400">
            Las personas detrás de Mi Boletín.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {TEAM.map(({ name, role }, i) => (
            <div
              key={name}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i]} flex items-center justify-center mb-4 text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300`}
              >
                {getInitials(name)}
              </div>
              <h3 className="text-sm font-semibold text-white">{name}</h3>
              <p className="text-xs text-slate-500 mt-1">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
