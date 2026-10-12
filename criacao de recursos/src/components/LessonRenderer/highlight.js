// Destaque de sintaxe (highlight.js, só as linguagens ensinadas) para os
// componentes de Programação. `LANGUAGES` alimenta o seletor do editor.
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import r from 'highlight.js/lib/languages/r';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import ruby from 'highlight.js/lib/languages/ruby';
import matlab from 'highlight.js/lib/languages/matlab';
import dart from 'highlight.js/lib/languages/dart';
import powershell from 'highlight.js/lib/languages/powershell';
import plaintext from 'highlight.js/lib/languages/plaintext';
import './code.css';

// value = chave usada na aula; hljs = nome no highlight.js
export const LANGUAGES = [
  { value: 'python', label: 'Python', hljs: 'python', mod: python },
  { value: 'javascript', label: 'JavaScript', hljs: 'javascript', mod: javascript },
  { value: 'typescript', label: 'TypeScript', hljs: 'typescript', mod: typescript },
  { value: 'java', label: 'Java', hljs: 'java', mod: java },
  { value: 'c', label: 'C', hljs: 'c', mod: c },
  { value: 'cpp', label: 'C++', hljs: 'cpp', mod: cpp },
  { value: 'csharp', label: 'C#', hljs: 'csharp', mod: csharp },
  { value: 'php', label: 'PHP', hljs: 'php', mod: php },
  { value: 'sql', label: 'SQL', hljs: 'sql', mod: sql },
  { value: 'html', label: 'HTML', hljs: 'xml', mod: xml },
  { value: 'css', label: 'CSS', hljs: 'css', mod: css },
  { value: 'bash', label: 'Terminal (Bash)', hljs: 'bash', mod: bash },
  { value: 'powershell', label: 'PowerShell', hljs: 'powershell', mod: powershell },
  { value: 'json', label: 'JSON', hljs: 'json', mod: json },
  { value: 'go', label: 'Go', hljs: 'go', mod: go },
  { value: 'rust', label: 'Rust', hljs: 'rust', mod: rust },
  { value: 'r', label: 'R', hljs: 'r', mod: r },
  { value: 'kotlin', label: 'Kotlin', hljs: 'kotlin', mod: kotlin },
  { value: 'swift', label: 'Swift', hljs: 'swift', mod: swift },
  { value: 'ruby', label: 'Ruby', hljs: 'ruby', mod: ruby },
  { value: 'dart', label: 'Dart', hljs: 'dart', mod: dart },
  { value: 'matlab', label: 'MATLAB / Octave', hljs: 'matlab', mod: matlab },
  { value: 'text', label: 'Texto simples', hljs: 'plaintext', mod: plaintext },
];

LANGUAGES.forEach((l) => {
  if (!hljs.getLanguage(l.hljs)) hljs.registerLanguage(l.hljs, l.mod);
});

export const languageLabel = (value) => LANGUAGES.find((l) => l.value === value)?.label || value || 'Código';

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Devolve o HTML do código destacado, linha a linha (para numerar/destacar linhas).
// Cada elemento do array é o HTML de uma linha; spans multilinha são fechados e
// reabertos a cada quebra, mantendo as cores.
export function highlightLines(code, language) {
  const source = String(code ?? '').replace(/\r\n?/g, '\n').replace(/\n+$/, '');
  const lang = LANGUAGES.find((l) => l.value === language)?.hljs || 'plaintext';
  let html;
  try {
    html = hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
  } catch {
    html = escapeHtml(source);
  }
  const open = [];
  return html.split('\n').map((line) => {
    const prefix = open.join('');
    const re = /<span[^>]*>|<\/span>/g;
    let m;
    while ((m = re.exec(line))) {
      if (m[0] === '</span>') open.pop();
      else open.push(m[0]);
    }
    return prefix + line + '</span>'.repeat(open.length);
  });
}

// "2,4-6" -> Set {2,4,5,6}
export function parseLineRanges(text) {
  const set = new Set();
  String(text ?? '').split(',').forEach((part) => {
    const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let i = Math.min(a, b); i <= Math.max(a, b) && i - Math.min(a, b) < 500; i += 1) set.add(i);
  });
  return set;
}
