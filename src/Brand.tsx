import React from 'react';
import ufcLogo from './assets/ufc.png';
import ufcLogoPb from './assets/ufc-pb.png';

// Símbolo do IUVI ("janelas para o futuro"), redesenhado em SVG a partir das
// proporções do Manual de Identidade Visual v1.1. Recipiente em degradê de
// magenta (ou branco, na versão negativa) com quatro janelas vazadas.
export function IuviSymbol({ height = 48, negative = false, id = 'iuvi-grad' }) {
  const window = negative ? '#510A32' : '#FFFFFF';
  return (
    <svg
      viewBox="0 0 274 343"
      style={{ display: 'block', flexShrink: 0 }}
      height={height}
      width={(height * 274) / 343}
      role="img"
      aria-label="Símbolo do Instituto UFC Virtual"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#510A32" />
          <stop offset="1" stopColor="#991F6D" />
        </linearGradient>
      </defs>
      <rect width="274" height="343" fill={negative ? '#FFFFFF' : `url(#${id})`} />
      <g fill={window}>
        <rect x="38" y="38" width="59" height="120" />
        <path d="M123 38h113v120H190a67 67 0 0 1-67-67z" />
        <path d="M38 184h113v53a67 67 0 0 1-67 67H38z" />
        <rect x="176" y="184" width="60" height="120" />
      </g>
    </svg>
  );
}

// Assinatura completa: símbolo + "Instituto" (Anek Regular) / "UFC Virtual" (Anek Extrabold)
export function IuviLogo({ height = 48, negative = false, id = 'iuvi-grad' }) {
  const color = negative ? '#FFFFFF' : '#000000';
  const size = height * 0.36;
  return (
    <div className="inline-flex items-center" style={{ gap: height * 0.12 }}>
      <IuviSymbol height={height} negative={negative} id={id} />
      <div
        className="font-anek leading-[0.95] whitespace-nowrap"
        style={{ color, fontSize: size }}
      >
        <div style={{ fontWeight: 400 }}>Instituto</div>
        <div style={{ fontWeight: 800 }}>UFC Virtual</div>
      </div>
    </div>
  );
}

// white=true: versão branca (P&B em negativo) para fundos escuros
export function UfcLogo({ height = 64, white = false }) {
  return (
    <img
      src={white ? ufcLogoPb : ufcLogo}
      alt="Universidade Federal do Ceará"
      style={{ height, filter: white ? 'brightness(0) invert(1)' : undefined }}
      className="w-auto"
    />
  );
}

// Faixa de padronagem formada pelas letras I e U (texturas da marca)
const tile = (fill: string, bg = 'none') =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='88' height='88' viewBox='0 0 88 88'><rect width='88' height='88' fill='${bg}'/><g fill='${fill}'><path d='M0 0h40v40H20A20 20 0 0 1 0 20z'/><rect x='48' y='0' width='40' height='40' rx='0'/><path d='M48 48h40v20a20 20 0 0 1-20 20H48z'/><path d='M0 48h40v40H0z' opacity='.55'/></g></svg>`
  )}")`;

export function PatternStrip({ className = '', dark = false }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: tile(dark ? '#991F50' : 'rgba(255,255,255,0.16)'),
        backgroundSize: '44px 44px',
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
