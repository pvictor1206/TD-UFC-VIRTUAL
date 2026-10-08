import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * ImageLightbox
 * - Clique para abrir em tela cheia
 * - Zoom por scroll, pinça (mobile) e duplo clique/toque
 * - Arrastar para mover quando der zoom
 * - Teclas: ESC para fechar, ←/→ navega (quando usado no Gallery)
 * - Suporta legendas e fundo escuro com blur
 */
export default function ImageLightbox({
  src,
  alt = "",
  caption,
  className = "rounded-xl shadow-sm cursor-zoom-in",
  maxScale = 4,
  minScale = 1,
}) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const resetTransform = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
  }, []);

  const openLightbox = () => {
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
  };
  const closeLightbox = useCallback(() => {
    setOpen(false);
    document.documentElement.style.overflow = "";
    resetTransform();
  }, [resetTransform]);

  // Zoom via scroll (Ctrl+wheel não é necessário)
  const onWheel = (e) => {
    if (!open) return;
    e.preventDefault();
    const delta = -e.deltaY; // para cima aumenta
    const step = 0.0015 * delta; // ajuste de sensibilidade

    const rect = imgRef.current?.getBoundingClientRect();
    const cx = e.clientX - (rect?.left || 0);
    const cy = e.clientY - (rect?.top || 0);

    setScale((prev) => {
      const next = clamp(prev + step, minScale, maxScale);
      // Reposiciona para zoom focado no cursor
      const k = next / prev;
      setOffset((o) => ({ x: cx - k * (cx - o.x), y: cy - k * (cy - o.y) }));
      return next;
    });
  };

  // Duplo clique/toque alterna zoom 1x ↔ 2x (ou volta para 1x se >2x)
  const onDouble = () => {
    setScale((prev) => {
      const next = prev === 1 ? 2 : 1;
      if (next === 1) resetTransform();
      return next;
    });
  };

  // Arrastar quando com zoom
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
    const next = {
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    };
    setOffset(next);
  };
  const onPointerUp = () => {
    setDragging(false);
    lastOffsetRef.current = offset;
  };

  // Gestos de pinça (mobile)
  const pinchRef = useRef({ dist: 0, startScale: 1, cx: 0, cy: 0 });
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      const dist = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
      const rect = imgRef.current?.getBoundingClientRect();
      const cx = (a.pageX + b.pageX) / 2 - (rect?.left || 0);
      const cy = (a.pageY + b.pageY) / 2 - (rect?.top || 0);
      pinchRef.current = { dist, startScale: scale, cx, cy };
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [a, b] = e.touches;
      const dist = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
      const { dist: d0, startScale, cx, cy } = pinchRef.current;
      const next = clamp((dist / d0) * startScale, minScale, maxScale);
      setScale((prev) => {
        const k = next / prev;
        setOffset((o) => ({ x: cx - k * (cx - o.x), y: cy - k * (cy - o.y) }));
        return next;
      });
    }
  };

  // Fechar com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeLightbox]);

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        className={className}
        aria-label="Abrir imagem em tela cheia"
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto object-contain rounded-inherit mx-auto block"
          style={{ maxHeight: "80vh" }}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col"
          onClick={(e) => {
            // fecha ao clicar fora da mídia
            if (e.target === e.currentTarget) closeLightbox();
          }}
          onWheel={onWheel}
        >
          <div className="flex items-center justify-between p-3 text-white/90 select-none">
            <span className="text-sm md:text-base line-clamp-1">
              {caption || alt}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setScale((s) => clamp(s * 1.15, minScale, maxScale))
                }
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Mais zoom"
              >
                +
              </button>
              <button
                onClick={() =>
                  setScale((s) => clamp(s / 1.15, minScale, maxScale))
                }
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Menos zoom"
              >
                −
              </button>
              <button
                onClick={resetTransform}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Resetar zoom"
              >
                1×
              </button>
              <button
                onClick={closeLightbox}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden touch-none">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              onDoubleClick={onDouble}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              className="absolute top-1/2 left-1/2 select-none will-change-transform"
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                maxWidth: "90vw",
                maxHeight: "80vh",
                transformOrigin: "0 0",
                transition: dragging ? "none" : "transform 120ms ease-out",
                cursor:
                  scale === 1 ? "zoom-in" : dragging ? "grabbing" : "grab",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * ImageGalleryLightbox
 * - Recebe uma lista de imagens e usa o mesmo overlay
 * - Navegação com setas e teclado
 */
export function ImageGalleryLightbox({
  images = [], // [{src, alt, caption}]
  columns = 3,
  gap = "gap-4",
}) {
  const [index, setIndex] = useState(-1);
  const current = index >= 0 ? images[index] : null;

  const close = useCallback(() => setIndex(-1), []);

  useEffect(() => {
    const onKey = (e) => {
      if (index < 0) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, close]);

  // Evita scroll de fundo quando aberto
  useEffect(() => {
    if (index >= 0) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
  }, [index]);

  return (
    <>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} ${gap}`}
      >
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className="relative group rounded-xl overflow-hidden shadow-sm bg-neutral-100"
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20" />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-gradient-to-t from-black/60 to-transparent">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {index >= 0 && (
        <LightboxOverlay
          item={current}
          onPrev={() => setIndex((i) => Math.max(i - 1, 0))}
          onNext={() => setIndex((i) => Math.min(i + 1, images.length - 1))}
          onClose={close}
          hasPrev={index > 0}
          hasNext={index < images.length - 1}
        />
      )}
    </>
  );
}

function LightboxOverlay({ item, onPrev, onNext, onClose, hasPrev, hasNext }) {
  // Reaproveita a lógica do componente simples
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const maxScale = 4,
    minScale = 1;
  const resetTransform = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const step = 0.0015 * delta;
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
    const next = {
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    };
    setOffset(next);
  };
  const onPointerUp = () => {
    setDragging(false);
    lastOffsetRef.current = offset;
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      const dist = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
      const rect = imgRef.current?.getBoundingClientRect();
      const cx = (a.pageX + b.pageX) / 2 - (rect?.left || 0);
      const cy = (a.pageY + b.pageY) / 2 - (rect?.top || 0);
      pinchRef.current = { dist, startScale: scale, cx, cy };
    }
  };
  const pinchRef = useRef({ dist: 0, startScale: 1, cx: 0, cy: 0 });
  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [a, b] = e.touches;
      const dist = Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
      const { dist: d0, startScale, cx, cy } = pinchRef.current;
      const next = clamp((dist / d0) * startScale, minScale, maxScale);
      setScale((prev) => {
        const k = next / prev;
        setOffset((o) => ({ x: cx - k * (cx - o.x), y: cy - k * (cy - o.y) }));
        return next;
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={onWheel}
    >
      <div className="flex items-center justify-between p-3 text-white/90 select-none">
        <span className="text-sm md:text-base line-clamp-1">
          {item?.caption || item?.alt}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => clamp(s * 1.15, minScale, maxScale))}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            aria-label="Mais zoom"
          >
            +
          </button>
          <button
            onClick={() => setScale((s) => clamp(s / 1.15, minScale, maxScale))}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            aria-label="Menos zoom"
          >
            −
          </button>
          <button
            onClick={resetTransform}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            aria-label="Resetar zoom"
          >
            1×
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden touch-none">
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Anterior"
          >
            ←
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Próximo"
          >
            →
          </button>
        )}

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
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          className="absolute top-1/2 left-1/2 select-none will-change-transform"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            maxWidth: "90vw",
            maxHeight: "80vh",
            transformOrigin: "0 0",
            transition: dragging ? "none" : "transform 120ms ease-out",
            cursor: scale === 1 ? "zoom-in" : dragging ? "grabbing" : "grab",
          }}
        />
      </div>
    </div>
  );
}

/**
 * EXEMPLOS DE USO
 *
 * // Imagem única
 * <ImageLightbox src="/imgs/mapa.png" alt="Mapa do projeto" caption="Mapa – versão 1.2" />
 *
 * // Galeria
 * <ImageGalleryLightbox
 *   images={[
 *     { src: "/imgs/01.jpg", alt: "Tela inicial", caption: "Home" },
 *     { src: "/imgs/02.jpg", alt: "Detalhe", caption: "Produto" },
 *     { src: "/imgs/03.jpg", alt: "Gráfico" },
 *   ]}
 *   columns={3}
 * />
 */