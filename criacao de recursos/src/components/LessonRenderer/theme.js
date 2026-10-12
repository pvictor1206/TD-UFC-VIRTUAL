// Cores base da aula escolhidas pelo professor (lesson.cor).
// A partir de uma única cor gera a paleta inteira como variáveis CSS, que
// sobrescrevem as do tema padrão (src/theme.css) só dentro da aula.

export const COLOR_PRESETS = [
  { name: 'Padrão (azul e lavanda)', value: '' },
  { name: 'Azul', value: '#2563eb' },
  { name: 'Roxo', value: '#7c3aed' },
  { name: 'Vinho (IUVI)', value: '#991f50' },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Laranja', value: '#ea580c' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Turquesa', value: '#0d9488' },
  { name: 'Grafite', value: '#475569' },
];

const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

const hsl = (h, s, l) => `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;

// Devolve o objeto `style` (variáveis CSS) para o contêiner da aula,
// ou undefined quando nenhuma cor foi escolhida (mantém o tema padrão).
export function lessonThemeStyle(cor) {
  if (!isHex(cor)) return undefined;
  const [h, s0] = hexToHsl(cor);
  const s = Math.min(Math.max(s0, 25), 85);
  const tint = Math.min(s, 70); // tons claros um pouco menos saturados
  return {
    '--color-lav': hsl(h, tint, 90),
    '--color-lav-soft': hsl(h, tint, 96),
    '--color-lav-mid': hsl(h, tint, 93),
    '--color-lav-bar': hsl(h, tint, 82),
    '--color-blue-50': hsl(h, tint, 96),
    '--color-blue-100': hsl(h, tint, 92),
    '--color-blue-200': hsl(h, tint, 87),
    '--color-blue-300': hsl(h, tint, 78),
    '--color-blue-400': hsl(h, s, 66),
    '--color-blue-500': hsl(h, s, 56),
    '--color-blue-600': hsl(h, s, 46),
    '--color-blue-700': hsl(h, s, 36),
    '--color-blue-800': hsl(h, s, 27),
    '--color-blue-900': hsl(h, s, 18),
    '--lesson-accent': hsl(h, s, 38),
    '--lesson-accent-soft': hsl(h, tint, 95),
  };
}
