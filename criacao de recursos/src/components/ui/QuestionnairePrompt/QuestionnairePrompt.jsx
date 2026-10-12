export default function QuestionnairePrompt({
  message = "null",
  buttonLabel = "null",
  href = "#",
  onClick,
  className = "", // opcional, para estilização extra
  
  // --- Parâmetros de Cor ---
  topBgColor = "var(--color-lav)",       // Fundo da caixa de texto
  topTextColor = "#1b1b3a",     // Cor do texto da mensagem
  buttonBgColor = "var(--color-lav-soft)",    // Fundo do botão
  buttonTextColor = "#1b1b3a",  // Cor do texto do botão

  // --- Novos Parâmetros de Fonte (Responsivos) ---
  messageFontSizeMobile = "14px",   // Tamanho da mensagem no celular
  messageFontSizeDesktop = "17px",  // Tamanho da mensagem no PC
  buttonFontSizeMobile = "11px",    // Tamanho do botão no celular
  buttonFontSizeDesktop = "12px",   // Tamanho do botão no PC
}) {
  return (
    <section 
      className={`py-4 px-0 ${className}`}
      // Criamos variáveis CSS dinâmicas baseadas nas props que você passar
      style={{
        "--msg-fs-mob": messageFontSizeMobile,
        "--msg-fs-desk": messageFontSizeDesktop,
        "--btn-fs-mob": buttonFontSizeMobile,
        "--btn-fs-desk": buttonFontSizeDesktop,
      }}
    >
      {/* Bloco de texto */}
      <div
        className="
          rounded-t-[14px]
          mx-auto w-full sm:w-4/5 md:w-3/5 max-w-[720px]
          p-4 sm:p-5 md:p-6
          flex items-center justify-center
        "
        style={{ backgroundColor: topBgColor }}
      >
        <p
          className="
            font-bold text-center break-words leading-relaxed
            text-[length:var(--msg-fs-mob)] md:text-[length:var(--msg-fs-desk)]
          "
          style={{ color: topTextColor }} 
        >
          {message}
        </p>
      </div>

      {/* Botão */}
      <div className="mx-auto w-full sm:w-4/5 md:w-3/5 max-w-[720px]">
        <a
          href={href}
          onClick={onClick}
          className="
            block text-center select-none font-bold uppercase tracking-wide
            rounded-b-[14px]
            h-12 sm:h-[50px] leading-[48px] sm:leading-[50px]
            focus:outline-none focus:ring-2 focus:ring-lav-bar
            hover:brightness-95 transition
            text-[length:var(--btn-fs-mob)] md:text-[length:var(--btn-fs-desk)]
          "
          style={{ 
            backgroundColor: buttonBgColor, 
            color: buttonTextColor,
          }}
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  );
}