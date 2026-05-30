import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange";
}

const iconStyles = {
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
};

const accentColors = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 pl-8 shadow-sm hover:shadow-md border border-slate-200 dark:border-gray-800 transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColors[color]}`} />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
            {title}
          </h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
