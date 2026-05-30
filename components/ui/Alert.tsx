import React from 'react';
import { ShieldAlert, Info, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'info' | 'success';
  message: string;
}

export function Alert({ type = 'error', message }: AlertProps) {
  if (!message) return null;

  const styles = {
    error: "bg-red-500/10 border-red-500/50 text-red-200",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-200",
    success: "bg-emerald-500/10 border-emerald-500/50 text-emerald-200"
  };

  const icons = {
    error: <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />,
    info: <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />,
    success: <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
  };

  return (
    <div className={`border p-4 rounded-xl mb-6 flex items-start gap-3 animate-pulse ${styles[type]}`}>
      {icons[type]}
      <p className="text-sm">{message}</p>
    </div>
  );
}
