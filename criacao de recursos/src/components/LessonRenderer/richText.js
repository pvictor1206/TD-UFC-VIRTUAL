// Texto formatado dos campos: **negrito**, *itálico* e linhas iniciadas por "•" (lista).
// Converte entre esse texto marcado (o que fica salvo na aula) e o HTML do campo editável.
// Usado pelos dois editores (Versão 1 e Versão 2), para o conteúdo ser idêntico nas duas.
// Cada quebra de linha digitada (Enter ou Shift+Enter) vira um "\n" no texto salvo.

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inlineToHtml = (line) =>
  escapeHtml(line)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

export function markupToHtml(text) {
  const lines = String(text ?? '').split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineToHtml(trimmed.slice(1).trim())}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div>${line === '' ? '<br>' : inlineToHtml(line)}</div>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

// Negrito/itálico valem por linha: as marcas não podem atravessar uma quebra.
const wrapLines = (text, mark) => text.split('\n').map((line) => (line ? `${mark}${line}${mark}` : line)).join('\n');

function inlineFromNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.split(String.fromCharCode(160)).join(' ');
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const tag = node.tagName;
  // <br> no meio do texto (Shift+Enter) é uma quebra; o último <br> é só o "enchimento" de linha vazia
  if (tag === 'BR') return node.nextSibling ? '\n' : '';
  const inner = Array.from(node.childNodes).map(inlineFromNode).join('');
  if (!inner) return '';
  const style = node.style || {};
  const bold = tag === 'B' || tag === 'STRONG' || style.fontWeight === 'bold' || Number(style.fontWeight) >= 600;
  const italic = tag === 'I' || tag === 'EM' || style.fontStyle === 'italic';
  let out = inner;
  if (italic) out = wrapLines(out, '*');
  if (bold) out = wrapLines(out, '**');
  return out;
}

const BLOCK_TAGS = /^(DIV|P|UL|OL|LI|H[1-6]|BLOCKQUOTE)$/;
const isBlock = (node) => node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.test(node.tagName);

export function htmlToMarkup(root) {
  const lines = [];
  let loose = null; // pedaços soltos (texto, negrito, <br>) fora de um bloco: formam a mesma linha

  const flush = () => {
    if (loose === null) return;
    if (loose.trim() !== '') lines.push(loose);
    else if (loose.includes('\n')) lines.push(''); // um <br> sozinho entre blocos é uma linha em branco
    loose = null;
  };

  const walk = (parent) => {
    Array.from(parent.childNodes).forEach((node) => {
      if (!isBlock(node)) {
        loose = (loose ?? '') + inlineFromNode(node);
        return;
      }
      flush();
      if (node.tagName === 'UL' || node.tagName === 'OL') {
        node.querySelectorAll(':scope > li').forEach((li) => lines.push(`• ${inlineFromNode(li)}`));
      } else if (Array.from(node.childNodes).some(isBlock)) {
        walk(node);
        flush();
      } else {
        lines.push(inlineFromNode(node));
      }
    });
  };

  walk(root);
  flush();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n').replace(/\n+$/, '');
}
