import React, { useState } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

// Cada marco começa compacto (ano + autor) e revela o "evento" ao ser clicado,
// seguindo o mesmo padrão de acordeão usado em DropdownContent (chevron + expand/collapse),
// para manter consistência visual com o restante do material.
const Timeline = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="relative border-l-4 border-blue-500 ml-6 space-y-8 py-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const eventoContent = typeof item.evento === 'function' ? item.evento() : item.evento;

        return (
          <div key={index} className="relative pl-8 group">
            <button
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              className="absolute -left-[14px] top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 group-hover:scale-125 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
              aria-label={`${isOpen ? 'Ocultar' : 'Revelar'} detalhes de ${item.ano} - ${item.autor}`}
            />
            <button
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-bold">
                    {item.ano}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.autor}</span>
                </div>
                <span className="text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-full p-1 flex items-center justify-center shrink-0">
                  {isOpen ? <GoChevronUp size={16} /> : <GoChevronDown size={16} />}
                </span>
              </div>

              {isOpen && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 italic">
                  {eventoContent}
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
