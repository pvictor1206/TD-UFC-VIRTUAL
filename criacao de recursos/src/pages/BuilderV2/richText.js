// Texto formatado dos campos: **negrito**, *itálico* e linhas iniciadas por "•" (lista).
// Converte entre esse texto marcado (o que fica salvo na aula) e o HTML do campo editável.
// É a mesma conversão do editor de texto da Versão 1, para o conteúdo ser idêntico nas duas.

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

function inlineFromNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.split(String.fromCharCode(160)).join(' ');
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const tag = node.tagName;
  if (tag === 'BR') return '';
  const inner = Array.from(node.childNodes).map(inlineFromNode).join('');
  if (!inner) return '';
  const style = node.style || {};
  const bold = tag === 'B' || tag === 'STRONG' || style.fontWeight === 'bold' || Number(style.fontWeight) >= 600;
  const italic = tag === 'I' || tag === 'EM' || style.fontStyle === 'italic';
  let out = inner;
  if (italic) out = `*${out}*`;
  if (bold) out = `**${out}**`;
  return out;
}

export function htmlToMarkup(root) {
  const lines = [];
  const pushNode = (el) => {
    if (el.nodeType === Node.TEXT_NODE) {
      if (el.textContent.trim() !== '') lines.push(inlineFromNode(el));
      return;
    }
    if (el.nodeType !== Node.ELEMENT_NODE) return;
    const tag = el.tagName;
    if (tag === 'UL' || tag === 'OL') {
      el.querySelectorAll(':scope > li').forEach((li) => lines.push(`• ${inlineFromNode(li)}`));
    } else if ((tag === 'DIV' || tag === 'P') && el.querySelector(':scope > ul, :scope > ol, :scope > div, :scope > p')) {
      Array.from(el.childNodes).forEach(pushNode);
    } else {
      lines.push(inlineFromNode(el));
    }
  };
  Array.from(root.childNodes).forEach(pushNode);
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}
