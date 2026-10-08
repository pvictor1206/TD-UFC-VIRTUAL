// ComparisonTable.jsx
export default function ComparisonTable({
  title,
  leftHeader = "Presencial",
  rightHeader = "EaD",
  rows = [],
  className = "",
  colors = {
    headBg: "#BFDBFE",   // azul do cabeçalho
    headText: "#343A40",
    zebra: "#DBEAFE",    // faixa clara alternada
    zebra_two: "#EFF6FF",    // faixa clara alternada
    border: "#93C5FD",   // divisões horizontais
    divider: "#FFF",  // linha vertical entre colunas
    caption: "#0C1E33",
  },
  
  // --- Novos Parâmetros de Fonte (Responsivos) ---
  titleFontSizeMobile = "16px",
  titleFontSizeDesktop = "18px",
  
  headerFontSizeMobile = "13px",
  headerFontSizeDesktop = "14px",
  
  rowFontSizeMobile = "13px",
  rowFontSizeDesktop = "14px",
}) {
  return (
    <div 
      className={`w-full max-w-4xl mx-auto ${className}`}
      // Criamos as variáveis CSS dinâmicas para os tamanhos de fonte
      style={{
        "--title-fs-mob": titleFontSizeMobile,
        "--title-fs-desk": titleFontSizeDesktop,
        "--head-fs-mob": headerFontSizeMobile,
        "--head-fs-desk": headerFontSizeDesktop,
        "--row-fs-mob": rowFontSizeMobile,
        "--row-fs-desk": rowFontSizeDesktop,
      }}
    >
      {title && (
        <h3 
          className="text-left pb-[12px] font-semibold text-[#0C1E33] mb-2 text-[length:var(--title-fs-mob)] md:text-[length:var(--title-fs-desk)]"
        >
          {title}
        </h3>
      )}

      {/* Sem ring (remove a borda preta). Mantém cantos e clipping. */}
      <div className="rounded-md overflow-hidden bg-white">
        {/* Cabeçalho */}
        <div
          className="grid grid-cols-2 text-center font-semibold text-[length:var(--head-fs-mob)] md:text-[length:var(--head-fs-desk)]"
          style={{ backgroundColor: colors.headBg, color: colors.headText }}
        >
          <div className="py-3 uppercase">{leftHeader}</div>
          <div
            className="py-3 uppercase"
            style={{ borderLeft: `3px solid ${colors.divider}` }}
          >
            {rightHeader}
          </div>
        </div>

        {/* Linhas */}
        <div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-2 text-[length:var(--row-fs-mob)] md:text-[length:var(--row-fs-desk)]"
              style={{
                backgroundColor: i % 2 === 1 ? colors.zebra : colors.zebra_two,
                // usamos borda superior por linha (em vez de divide-y) para controlar a cor
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <div className="px-4 py-3 text-center">{r.left}</div>
              <div
                className="px-4 py-3 text-center"
                // borda à esquerda contínua em toda a coluna direita
                style={{ borderLeft: `3px solid ${colors.divider}` }}
              >
                {r.right}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*{footnote && (
        <p className="mt-2 text-[12px]" style={{ color: colors.caption }}>
          <sup>1</sup> {footnote}
        </p>
      )}*/}
    </div>
  );
}