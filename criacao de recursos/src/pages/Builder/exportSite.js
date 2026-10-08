import JSZip from 'jszip';

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename, data) {
  downloadBlob(filename, new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
}

export const slugify = (text) =>
  (text || 'aula')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'aula';

const escapeHtml = (text = '') =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildStandaloneHtml(lesson) {
  // Embute o conteúdo da aula como dado global antes de carregar o script
  // compilado (standalone.js). "<" é escapado para não fechar a tag
  // <script> caso algum texto da aula contenha "</script>".
  const json = JSON.stringify(lesson).replace(/</g, '\u003c');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(lesson.titulo || 'Aula')}</title>
<link rel="stylesheet" href="standalone.css" />
</head>
<body>
<div id="lesson-root"></div>
<script>window.__LESSON_CONTENT__ = ${json};</script>
<script src="standalone.js"></script>
</body>
</html>
`;
}

// Padrão: busca os arquivos compilados em public/standalone/ via HTTP.
// Quando o Construtor é embutido em outra aplicação, ela pode informar um
// `loadAssets` próprio que devolve { js, css }.
async function fetchStandaloneAssets() {
  const base = import.meta.env.BASE_URL;
  const [jsRes, cssRes] = await Promise.all([
    fetch(`${base}standalone/standalone.js`),
    fetch(`${base}standalone/standalone.css`),
  ]);
  if (!jsRes.ok || !cssRes.ok) throw new Error('Pacote standalone não encontrado');
  const [js, css] = await Promise.all([jsRes.text(), cssRes.text()]);
  return { js, css };
}

// Gera o .zip (index.html + standalone.js + standalone.css) e baixa.
export async function downloadLessonSite(lesson, loadAssets = fetchStandaloneAssets) {
  const { js, css } = await loadAssets();
  const zip = new JSZip();
  zip.file('index.html', buildStandaloneHtml(lesson));
  zip.file('standalone.js', js);
  zip.file('standalone.css', css);
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(`site_${slugify(lesson.titulo)}.zip`, blob);
}
