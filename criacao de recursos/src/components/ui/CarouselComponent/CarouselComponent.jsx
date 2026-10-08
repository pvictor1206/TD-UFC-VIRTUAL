import React, { useState, useRef, useEffect } from "react";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";

export default function CarouselCoverflow({
  images = [],
  // --- Parâmetros de Cores ---
  colors = {
    arrowBg: "#1e3a8a",        // Azul escuro do fundo da seta
    arrowIcon: "#FFFFFF",      // Branco do ícone da seta
    dotActive: "#1e3a8a",      // Azul escuro do traço ativo
    dotInactive: "#93C5FD",    // Azul claro dos traços inativos
  },
  // --- Tamanhos de Fonte Responsivos (usados no Lightbox) ---
  titleFontSizeMobile = "14px",
  titleFontSizeDesktop = "16px",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const length = images.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  // Calcula a posição e o estilo 3D de cada imagem
  const getSlideClass = (index) => {
    let offset = index - currentIndex;
    if (offset < -1) offset += length;
    if (offset > 1) offset -= length;

    // Imagem Central (Ativa)
    if (offset === 0) {
      return "opacity-100 translate-x-0 scale-100 z-30 cursor-zoom-in";
    }
    // Imagem da Esquerda
    else if (offset === -1 || offset === length - 1) {
      return "opacity-60 -translate-x-[60%] scale-75 z-20 cursor-pointer hover:opacity-80";
    }
    // Imagem da Direita
    else if (offset === 1 || offset === -(length - 1)) {
      return "opacity-60 translate-x-[60%] scale-75 z-20 cursor-pointer hover:opacity-80";
    }
    // Oculta as demais imagens se houver mais de 3
    return "opacity-0 translate-x-0 scale-50 z-10 hidden pointer-events-none";
  };

  if (!images || length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center py-8">
      
      {/* Container do Carrossel */}
      {/* Container do Carrossel (Removemos o overflow-hidden para os botões poderem vazar para as laterais) */}
      <div className="relative w-full max-w-4xl h-[300px] md:h-[450px] flex items-center justify-center">
        
        {/* Seta Esquerda - Usando valores negativos para empurrar para fora (-left-12, -left-20) */}
        <button
          onClick={prevSlide}
          className="absolute -left-2 sm:-left-8 md:-left-12 lg:-left-8 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: colors.arrowBg }}
          aria-label="Anterior"
        >
          <IoArrowBack size={24} color={colors.arrowIcon} />
        </button>

        {/* Seta Direita - Usando valores negativos para empurrar para fora (-right-12, -right-20) */}
        <button
          onClick={nextSlide}
          className="absolute -right-2 sm:-right-8 md:-right-12 lg:-right-8 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: colors.arrowBg }}
          aria-label="Próximo"
        >
          <IoArrowForward size={24} color={colors.arrowIcon} />
        </button>

        {/* Imagens (Slides) */}
        <div className="relative w-[60%] md:w-[45%] h-full flex items-center justify-center">
          {images.map((img, index) => {
            let offset = index - currentIndex;
            if (offset < -1) offset += length;
            if (offset > 1) offset -= length;

            const isCenter = offset === 0;

            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${getSlideClass(index)}`}
                onClick={() => {
                  if (isCenter) setSelectedImage(img); // Abre o lightbox apenas se for a central
                  else if (offset === -1 || offset === length - 1) prevSlide(); // Vai pra esquerda
                  else nextSlide(); // Vai pra direita
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="w-full h-full object-cover rounded-3xl shadow-xl select-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores (Tracinhos inferiores) */}
      <div className="flex gap-3 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="h-1.5 md:h-2 w-8 md:w-12 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: index === currentIndex ? colors.dotActive : colors.dotInactive,
            }}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Lightbox Integrado */}
      {selectedImage && (
        <TailwindLightboxOverlay
          item={selectedImage}
          onClose={() => setSelectedImage(null)}
          titleFontSizeMobile={titleFontSizeMobile}
          titleFontSizeDesktop={titleFontSizeDesktop}
        />
      )}
    </div>
  );
}

/**
 * Componente do Lightbox com Tailwind (Mantido com Zoom e Arraste)
 */
function TailwindLightboxOverlay({ item, onClose, titleFontSizeMobile, titleFontSizeDesktop }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const minScale = 1;
  const maxScale = 5;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const resetTransform = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const step = 0.002 * delta;
    const rect = imgRef.current?.getBoundingClientRect();
    const cx = e.clientX - (rect?.left || 0);
    const cy = e.clientY - (rect?.top || 0);

    setScale((prev) => {
      const next = clamp(prev + step, minScale, maxScale);
      const k = next / prev;
      setOffset((o) => ({ x: cx - k * (cx - o.x), y: cy - k * (cy - o.y) }));
      return next;
    });
  };

  const onDouble = () => {
    setScale((prev) => {
      const next = prev === 1 ? 2 : 1;
      if (next === 1) resetTransform();
      return next;
    });
  };

  const onPointerDown = (e) => {
    if (scale === 1) return;
    setDragging(true);
    imgRef.current?.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setOffset({ x: lastOffsetRef.current.x + dx, y: lastOffsetRef.current.y + dy });
  };
  const onPointerUp = () => {
    setDragging(false);
    lastOffsetRef.current = offset;
  };

  const btnClass = "w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer select-none";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#222222] flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onWheel={onWheel}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        
        {/* Usando os estilos dinâmicos de fonte aqui */}
        <span 
          className="text-white font-medium drop-shadow-md"
          style={{ 
             fontSize: window.innerWidth < 768 ? titleFontSizeMobile : titleFontSizeDesktop 
          }}
        >
          {item?.caption || item?.alt}
        </span>
        
        <div className="flex gap-2">
          <button onClick={() => setScale((s) => clamp(s * 1.25, minScale, maxScale))} className={btnClass} aria-label="Aumentar Zoom">+</button>
          <button onClick={() => setScale((s) => clamp(s / 1.25, minScale, maxScale))} className={btnClass} aria-label="Diminuir Zoom">−</button>
          <button onClick={resetTransform} className={btnClass} aria-label="Resetar Zoom">1x</button>
          <button onClick={onClose} className={btnClass} aria-label="Fechar">✕</button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden touch-none flex items-center justify-center">
        <img
          ref={imgRef}
          src={item?.src}
          alt={item?.alt || ""}
          draggable={false}
          onDoubleClick={onDouble}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="select-none will-change-transform shadow-2xl rounded-md"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            maxWidth: "90vw",
            maxHeight: "85vh",
            transition: dragging ? "none" : "transform 150ms cubic-bezier(0.2, 0, 0.2, 1)",
            cursor: scale === 1 ? "zoom-in" : dragging ? "grabbing" : "grab",
          }}
        />
      </div>
    </div>
  );
}