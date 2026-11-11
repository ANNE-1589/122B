import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let Icon = Info;
        if (toast.type === 'success') {
          bg = 'bg-[#172B4D] text-white border-l-4 border-[#F2A65A]';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900 text-white border-l-4 border-rose-500';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-900 text-white border-l-4 border-amber-500';
          Icon = AlertTriangle;
        } else if (toast.type === 'info') {
          bg = 'bg-[#172B4D] text-white border-l-4 border-[#7AAED6]';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5 text-[#F2A65A]" />
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors p-0.5"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
