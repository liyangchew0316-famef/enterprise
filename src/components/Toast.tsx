import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgStyle = 
    toast.type === 'success' ? 'bg-[#1a1c1c] text-white border-[#af101a]' :
    toast.type === 'warning' ? 'bg-amber-900 text-white border-amber-500' :
    'bg-gray-900 text-white border-gray-700';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-xl text-sm font-medium ${bgStyle}`}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#af101a] shrink-0" />}
        {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        <span className="flex-1">{toast.message}</span>
      </div>
    </div>
  );
};
