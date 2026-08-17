import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const bgStyle = 
    toast.type === 'success' ? 'bg-[#1a1c1c] text-white border-[#af101a]' :
    toast.type === 'warning' ? 'bg-amber-950 text-amber-100 border-amber-500' :
    'bg-gray-900 text-white border-blue-500';

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200 transition-all pointer-events-auto"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-l-4 shadow-2xl text-xs sm:text-sm font-medium ${bgStyle}`}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        
        <span className="flex-1 leading-snug">{toast.message}</span>

        <button
          onClick={hideToast}
          aria-label="Close notification"
          className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
