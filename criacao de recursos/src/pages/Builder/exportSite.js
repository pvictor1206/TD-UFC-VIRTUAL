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

// Percorre as imagens da aula (bloco "image" e "carousel", inclusive dentro de capítulos).
function walkImages(sections, visit) {
  for (const s of sections || []) {
    if (!s) continue;
    if (s.type === 'image' && s.src) visit(s);
    if (s.type === 'carousel') (s.images || []).forEach((img) => img && img.src && visit(img));
    if (Array.isArray(s.children)) walkImages(s.children, visit);
  }
}

const IMAGE_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

// Baixa as imagens com endereço http(s) para a pasta imagens/ do .zip e troca o endereço pelo arquivo
// local, para o site funcionar sem internet. Se alguma não puder ser baixada, o link original é mantido.
export async function embedImages(lesson, zip) {
  const copy = JSON.parse(JSON.stringify(lesson));
  const byUrl = new Map();
  const tasks = [];
  let count = 0;
  walkImages(copy.sections, (obj) => {
    const url = obj.src;
    if (!/^https?:\/\//i.test(url)) return;
    if (!byUrl.has(url)) {
      count += 1;
      const position = count;
      byUrl.set(
        url,
        fetch(url)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('falhou'))))
          .then((blob) => {
            const fromUrl = (url.split('?')[0].match(/\.([a-z0-9]{2,4})$/i) || [])[1];
            const ext = IMAGE_EXT[blob.type] || (fromUrl ? fromUrl.toLowerCase() : 'img');
            const name = `imagens/imagem_${String(position).padStart(2, '0')}.${ext}`;
            zip.file(name, blob);
            return name;
          })
          .catch(() => null)
      );
    }
    tasks.push(byUrl.get(url).then((name) => { if (name) obj.src = name; }));
  });
  await Promise.all(tasks);
  return copy;
}

// Gera o .zip (index.html + standalone.js + standalone.css + imagens/) e baixa.
export async function downloadLessonSite(lesson, loadAssets = fetchStandaloneAssets) {
  const { js, css } = await loadAssets();
  const zip = new JSZip();
  zip.file('index.html', buildStandaloneHtml(await embedImages(lesson, zip)));
  zip.file('standalone.js', js);
  zip.file('standalone.css', css);
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(`site_${slugify(lesson.titulo)}.zip`, blob);
}
