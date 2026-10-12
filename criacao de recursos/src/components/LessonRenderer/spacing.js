// Espaçamento vertical entre componentes, títulos e seções (opção do professor).
// O valor é uma quantidade em pixels (ex: "24"). Vazio = espaçamento padrão de
// cada componente (nada é alterado). Aulas antigas usavam nomes (pequeno, médio...),
// que continuam funcionando e são convertidos para px.

const LEGACY_PX = { none: 0, sm: 8, md: 16, lg: 32, xl: 56 };

export const SPACING_MAX_PX = 400;

// Número de pixels, ou undefined para o padrão.
export function spacingPx(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (Object.prototype.hasOwnProperty.call(LEGACY_PX, value)) return LEGACY_PX[value];
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.min(Math.round(n), SPACING_MAX_PX);
}

// Valor CSS (ex: "24px") ou undefined para o padrão.
export const spacingValue = (value) => {
  const px = spacingPx(value);
  return px === undefined ? undefined : `${px}px`;
};
