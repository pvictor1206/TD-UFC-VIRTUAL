import { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

export default function DropdownContent({
  title,
  text,
  imageUrl,
  altText,

  // --- Cores Customizáveis ---
  bgColor = "#FAFBFF",         // Fundo bem claro para bater com a imagem
  hoverBgColor = "#EFF6FF",    // Leve destaque ao passar o mouse
  borderColor = "#BFDBFE",     // Linha divisória em tom azul claro
  titleTextColor = "#333333",  // Cor do título
  contentTextColor = "#333333", // Cor do texto interno
  iconColor = "#1e40af",       // Azul escuro para o ícone

  // --- Tamanhos de Fonte Responsivos ---
  titleFontSizeMobile = "14px",
  titleFontSizeDesktop = "15px",
  
  contentFontSizeMobile = "14px",
  contentFontSizeDesktop = "15px",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="w-full"
      style={{
        // Mapeando as props para variáveis CSS
        "--dropdown-bg": bgColor,
        "--dropdown-hover": hoverBgColor,
        "--dropdown-border": borderColor,
        "--dropdown-title-color": titleTextColor,
        "--dropdown-content-color": contentTextColor,
        "--dropdown-icon-color": iconColor,
        "--title-fs-mob": titleFontSizeMobile,
        "--title-fs-desk": titleFontSizeDesktop,
        "--content-fs-mob": contentFontSizeMobile,
        "--content-fs-desk": contentFontSizeDesktop,
      }}
    >
      {/* Margem negativa (-mb-px) para mesclar bordas quando empilhados */}
      <div className="border border-[color:var(--dropdown-border)] -mb-px transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center px-6 py-4 bg-[color:var(--dropdown-bg)] hover:bg-[color:var(--dropdown-hover)] text-[color:var(--dropdown-title-color)] transition-colors"
        >
          <span className="text-left font-medium text-[length:var(--title-fs-mob)] md:text-[length:var(--title-fs-desk)]">
            {title}
          </span>
          {/* Englobando o ícone para simular o círculo da sua imagem */}
          <span className="text-[color:var(--dropdown-icon-color)] border border-[color:var(--dropdown-icon-color)] rounded-full p-0.5 flex items-center justify-center">
            {isOpen ? <GoChevronUp size={16} /> : <GoChevronDown size={16} />}
          </span>
        </button>

        {isOpen && (
          <div className="px-6 py-5 bg-[color:var(--dropdown-bg)] border-t border-[color:var(--dropdown-border)] text-left">
            <div className="text-[color:var(--dropdown-content-color)] text-[length:var(--content-fs-mob)] md:text-[length:var(--content-fs-desk)]">
              {typeof text === "string" ? (
                text.split("\n").map((line, index) => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.startsWith("•")) {
                    return (
                      <div key={index} className="flex items-start gap-3 ml-4 mb-3">
                        <span className="text-[color:var(--dropdown-icon-color)] font-bold mt-1.5 text-[8px]">●</span>
                        <span className="flex-1 text-left">{trimmedLine.substring(1).trim()}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className={`${trimmedLine === "" ? "h-4" : "mb-4"} text-left leading-relaxed`}>
                      {line}
                    </p>
                  );
                })
              ) : (
                text
              )}
            </div>
            {imageUrl && (
              <div className="flex justify-center mt-6">
                <img
                  src={imageUrl}
                  alt={altText || "Imagem do conteúdo expansível"}
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}