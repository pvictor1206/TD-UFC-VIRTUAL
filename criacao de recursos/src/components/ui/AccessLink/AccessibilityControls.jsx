import React from 'react';
import { MdFormatSize, MdAdd, MdRemove, MdSettingsBackupRestore } from 'react-icons/md';

const AccessibilityControls = ({ setFontSize, min = 12, max = 32, step = 2, defaultSize = 18 }) => {
  const increase = () => setFontSize(prev => Math.min(prev + step, max));
  const decrease = () => setFontSize(prev => Math.max(prev - step, min));
  const reset = () => setFontSize(defaultSize); // Tamanho padrão

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-2 scale-90 md:scale-100 animate-in slide-in-from-right duration-500">
      <div className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl p-2 flex flex-col gap-2 items-center">
        <div className="p-2 text-blue-800 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 mb-1" title="Acessibilidade: Tamanho da Fonte">
          <MdFormatSize size={24} />
        </div>
        
        <button 
          onClick={increase}
          className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Aumentar Fonte"
          aria-label="Aumentar tamanho da fonte"
        >
          <MdAdd size={20} />
        </button>

        <button 
          onClick={decrease}
          className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
          title="Diminuir Fonte"
          aria-label="Diminuir tamanho da fonte"
        >
          <MdRemove size={20} />
        </button>

        <button 
          onClick={reset}
          className="p-3 text-gray-400 hover:text-red-500 transition-colors"
          title="Resetar"
          aria-label="Resetar tamanho da fonte para o padrão"
        >
          <MdSettingsBackupRestore size={18} />
        </button>
      </div>
    </div>
  );
};

export default AccessibilityControls;
