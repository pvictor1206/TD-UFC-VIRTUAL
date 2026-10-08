import { GoArrowDown } from "react-icons/go";

export default function ReferenceInfoBox({ 
  id, 
  quote, 
  reference, 
  targetId, 
  headerOffset = 0,
  
  // --- Novos Parâmetros de Cor ---
  bgColor = "#FFFFFF",         // Fundo branco padrão
  borderColor = "#93C5FD",     // Borda lateral azul padrão
  quoteTextColor = "#0C1E33",  // Cor do texto da citação
  refTextColor = "#0C1E33",    // Cor do texto da referência ("Referência 1")
  iconColor = "#0C1E33",       // Cor do ícone da setinha

  // --- Novos Parâmetros de Fonte (Responsivos) ---
  quoteFontSizeMobile = "14px",
  quoteFontSizeDesktop = "16px",
  refFontSizeMobile = "12px",
  refFontSizeDesktop = "14px",
}) {
  const scrollToTarget = (targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div 
      id={id} 
      className="pt-[10px] pb-[20px]"
      // Criamos as variáveis CSS dinâmicas para o tamanho da fonte
      style={{
        "--quote-fs-mob": quoteFontSizeMobile,
        "--quote-fs-desk": quoteFontSizeDesktop,
        "--ref-fs-mob": refFontSizeMobile,
        "--ref-fs-desk": refFontSizeDesktop,
      }}
    >
      <div 
        className="flex border-l-[5px] rounded-md shadow-md p-4 max-w-3xl mx-auto"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor
        }}
      >
        <div className="flex-1">
          <p
            className="italic leading-relaxed text-[length:var(--quote-fs-mob)] md:text-[length:var(--quote-fs-desk)]"
            style={{ color: quoteTextColor }}
            dangerouslySetInnerHTML={{ __html: quote }}
          />
          { (reference || targetId) && (
            <div className="flex items-center justify-end gap-2 mt-2">
              <p 
                className="italic text-[length:var(--ref-fs-mob)] md:text-[length:var(--ref-fs-desk)]"
                style={{ color: refTextColor }}
              >
                {reference}
              </p>
              {targetId && (
                <button
                  type="button"
                  onClick={() => scrollToTarget(targetId)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Ir para referência"
                  title="Ir para referência"
                  style={{ color: iconColor }}
                >
                  <GoArrowDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}