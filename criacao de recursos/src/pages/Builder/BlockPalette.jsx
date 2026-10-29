import { SECTION_CATALOG, GROUPS } from '@lesson';
import HelpButton from './HelpButton';

// Tipo de dado usado ao arrastar um componente até um capítulo.
export const DRAG_TYPE = 'application/x-editor-componente';

export default function BlockPalette({ onAdd, disabled = false }) {
  return (
    <div className={`space-y-5 ${disabled ? 'opacity-50' : ''}`} aria-disabled={disabled}>
      {GROUPS.map((group) => {
        const blocks = SECTION_CATALOG.filter((b) => b.group === group.id && b.type !== 'section');
        if (blocks.length === 0) return null;
        return (
          <div key={group.id}>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{group.label}</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {blocks.map((block) => (
                <div
                  key={block.type}
                  className="flex items-center gap-1.5"
                  draggable={!disabled}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DRAG_TYPE, block.type);
                    e.dataTransfer.setData('text/plain', block.label);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                <button
                  type="button"
                  onClick={() => onAdd(block.type)}
                  title={`${block.description} Clique ou arraste até um capítulo.`}
                  className="flex flex-1 min-w-0 items-center gap-2 text-left cursor-grab active:cursor-grabbing rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:border-blue-300 hover:bg-lav-soft dark:hover:bg-blue-950/30 transition-colors"
                >
                  <span className="text-base">{block.icon}</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{block.label}</span>
                </button>
                  <HelpButton definition={block} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
