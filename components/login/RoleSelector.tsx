import { GraduationCap, User } from "lucide-react";

export type Role = "estudiante" | "profesor";

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

const ROLES = [
  {
    id: "estudiante" as Role,
    label: "Estudiante",
    icon: GraduationCap,
    activeClass: "bg-blue-600 text-white shadow-lg shadow-blue-500/20",
  },
  {
    id: "profesor" as Role,
    label: "Profesor",
    icon: User,
    activeClass: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="p-1 bg-slate-800/60 border border-white/5 rounded-xl flex gap-1">
      {ROLES.map(({ id, label, icon: Icon, activeClass }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            value === id
              ? activeClass
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
