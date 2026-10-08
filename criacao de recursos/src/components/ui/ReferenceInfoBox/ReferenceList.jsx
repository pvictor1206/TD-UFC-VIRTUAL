import { GoArrowUp } from "react-icons/go";

export default function ReferenceList({ 
  references, 
  headerOffset = 0,
  
  // --- Novos Parâmetros de Fonte (Responsivos) ---
  fontSizeMobile = "14px",   // Tamanho da fonte padrão no celular
  fontSizeDesktop = "16px"   // Tamanho da fonte padrão no computador
}) {
  // references: [{ number?: string|number, text: string, targetId: string, sourceId: string }]
  const scrollToTarget = (targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div 
      className="max-w-5xl mx-auto p-4"
      // Criamos as variáveis CSS dinâmicas para o tamanho da fonte
      style={{
        "--list-fs-mob": fontSizeMobile,
        "--list-fs-desk": fontSizeDesktop,
      }}
    >
      <h2 className="text-start text-lg font-semibold mb-[40px]">Referências</h2>
      
      {/* Aqui aplicamos as variáveis dinâmicas no lugar do text-sm fixo */}
      <ul 
        className="
          text-start space-y-4 text-[#0C1E33] leading-relaxed
          text-[length:var(--list-fs-mob)] md:text-[length:var(--list-fs-desk)]
        "
      >
        {references.map((ref, i) => (
          <li key={ref.targetId} id={ref.targetId} className="flex items-start gap-2">
            {/* Usa number se vier, senão usa index */}
            <span className="font-medium">{ref.number ?? i + 1}:</span>
            <span className="flex-1">{ref.text}</span>
            <button
              type="button"
              onClick={() => scrollToTarget(ref.sourceId)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={`Ir para a citação ${ref.number ?? i + 1}`}
              title="Ir para a citação"
            >
              <GoArrowUp className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}