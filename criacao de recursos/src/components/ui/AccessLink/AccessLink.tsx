// components/AccessLink/AccessLink.jsx
import { FaLink } from "react-icons/fa";

export default function AccessLink({
  label = "LINK PARA ACESSO - TÍTULO DA IMAGEM",
  href = "",                       // opcional: se vier, vira um <a>
  target = "_blank",
  rel = "noopener noreferrer",
  className = "",
  widthClass = "",                 // opcional: para customizar as larguras
  // --- Novos Parâmetros de Estilo ---
  colors = {
    bg: "#EFF6FF",      // Fundo da caixa
    icon: "#93C5FD",    // Cor do ícone
    text: "#0C1E33",    // Cor do texto
  },
  fontSizeMobile = "14px",
  fontSizeDesktop = "16px",
}) {
  // Padrão "w-full" para pegar 100% da largura do container onde ele for colocado
  const containerWidth = widthClass || "w-full";

  const Box = (
    <div 
      className="flex items-center gap-3 rounded-[7px] p-3 sm:p-4 shadow-md transition-colors"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Aplicamos a cor direto na prop do ícone */}
      <FaLink color={colors.icon} size={18} className="flex-shrink-0" />
      
      {/* Texto com cores e tamanhos dinâmicos */}
      <p className="font-semibold break-words" style={{ color: colors.text }}>
        
        {/* Renderiza apenas no Mobile (< 640px) */}
        <span className="sm:hidden" style={{ fontSize: fontSizeMobile }}>
          {label}
        </span>
        
        {/* Renderiza no Tablet e Desktop (>= 640px) */}
        <span className="hidden sm:inline" style={{ fontSize: fontSizeDesktop }}>
          {label}
        </span>
        
      </p>
    </div>
  );

  return (
    <section className={`pt-[70px] pb-[80px] ${className}`}>
      <div className={`mx-auto ${containerWidth}`}>
        {href ? (
          <a
            href={href}
            target={target}
            rel={rel}
            // Trocamos focus:ring por focus:outline (nativo)
            className="block hover:brightness-95 focus:outline focus:outline-2 focus:outline-offset-2 transition rounded-[7px]"
            // Agora usamos outlineColor, que o React aceita nativamente sem dar erro
            style={{ outlineColor: colors.icon }} 
          >
            {Box}
          </a>
        ) : (
          Box
        )}
      </div>
    </section>
  );
}