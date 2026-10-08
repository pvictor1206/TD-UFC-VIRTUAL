export default function ReferenceBoxColor({ 
  quote,
  
  // --- Novos Parâmetros de Cor ---
  bgColor = "#f1f1f1",       // Fundo neutro claro padrão
  borderColor = "#BFDBFE",   // Borda lateral azul padrão
  textColor = "#0C1E33",     // Cor do texto padrão
  
  // --- Novos Parâmetros de Fonte (Responsivos) ---
  fontSizeMobile = "15px",   // Tamanho no celular
  fontSizeDesktop = "16px"   // Tamanho no PC
}) {
  return (
    // Margem vertical para separar dos outros blocos
    <div 
      className="py-[10px] my-6"
      // Criamos as variáveis CSS dinâmicas para o tamanho da fonte
      style={{
        "--ref-fs-mob": fontSizeMobile,
        "--ref-fs-desk": fontSizeDesktop,
      }}
    >
      <div 
        className="relative mx-auto max-w-3xl border-l-4 rounded-md shadow-sm p-6"
        style={{ 
          backgroundColor: bgColor,
          borderColor: borderColor 
        }}
      >
        <p
          className="
            italic leading-relaxed text-center
            text-[length:var(--ref-fs-mob)] md:text-[length:var(--ref-fs-desk)]
          "
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: quote }}
        />
      </div>
    </div>
  );
}