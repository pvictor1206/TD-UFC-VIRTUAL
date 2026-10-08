import { SECTION_CATALOG, GROUPS } from '@lesson';
import HelpButton from './HelpButton';

export default function BlockPalette({ onAdd }) {
  return (
    <div className="space-y-5">
      {GROUPS.map((group) => {
        const blocks = SECTION_CATALOG.filter((b) => b.group === group.id);
        if (blocks.length === 0) return null;
        return (
          <div key={group.id}>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{group.label}</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {blocks.map((block) => (
                <div key={block.type} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onAdd(block.type)}
                  title={block.description}
                  className="flex flex-1 min-w-0 items-center gap-2 text-left rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
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
