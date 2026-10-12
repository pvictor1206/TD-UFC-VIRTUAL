import { useEffect, useMemo, useRef, useState } from 'react';
import { highlightLines, languageLabel, parseLineRanges } from '@lesson/highlight';

const SCRIPT_END = '<' + '/script>';

// Executa JavaScript do aluno em um iframe isolado (sandbox, sem acesso à página)
// e devolve o que foi escrito com console.log/warn/error.
function runJavaScript(code, onLog, onDone) {
  const id = Math.random().toString(36).slice(2);
  const frame = document.createElement('iframe');
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.style.display = 'none';

  const finish = () => {
    window.removeEventListener('message', onMessage);
    clearTimeout(timer);
    frame.remove();
    onDone();
  };
  function onMessage(e) {
    if (e.source !== frame.contentWindow || !e.data || e.data.id !== id) return;
    if (e.data.type === 'done') finish();
    else onLog({ kind: e.data.kind, text: e.data.text });
  }
  const timer = setTimeout(() => {
    onLog({ kind: 'error', text: 'Tempo esgotado (a execução demorou demais).' });
    finish();
  }, 5000);

  window.addEventListener('message', onMessage);
  const source = JSON.stringify(code).replace(/</g, '\\u003c');
  frame.srcdoc =
    '<!doctype html><script>(function(){var id=' + JSON.stringify(id) + ';' +
    'var send=function(k,t){parent.postMessage({id:id,type:"log",kind:k,text:t},"*")};' +
    'var fmt=function(a){return Array.prototype.map.call(a,function(x){if(typeof x==="string")return x;' +
    'try{return typeof x==="object"?JSON.stringify(x):String(x)}catch(e){return String(x)}}).join(" ")};' +
    'console.log=function(){send("log",fmt(arguments))};console.info=console.log;' +
    'console.warn=function(){send("warn",fmt(arguments))};console.error=function(){send("error",fmt(arguments))};' +
    'window.onerror=function(m){send("error",String(m));return true};' +
    'try{(0,eval)(' + source + ')}catch(e){send("error",String(e))}' +
    'setTimeout(function(){parent.postMessage({id:id,type:"done"},"*")},50)})()' + SCRIPT_END;
  document.body.appendChild(frame);
  return finish;
}

// Bloco de código com destaque de sintaxe, números de linha, linhas em destaque,
// botão copiar, saída esperada e (opcional) execução de JavaScript/HTML pelo aluno.
export default function CodeBlock({
  code,
  language = 'python',
  filename,
  lineNumbers = 'sim',
  highlight,
  output,
  runnable = 'nao',
  caption,
  embedded = false,
}) {
  const lines = useMemo(() => highlightLines(code, language), [code, language]);
  const marked = useMemo(() => parseLineRanges(highlight), [highlight]);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState(null); // null = ainda não executou
  const [running, setRunning] = useState(false);
  const [preview, setPreview] = useState(false);
  const stopRef = useRef(null);

  useEffect(() => () => stopRef.current?.(), []);
  useEffect(() => { setLogs(null); setPreview(false); }, [code, language]);

  if (!code && !output) return null;

  const canRun = runnable === 'sim' && (language === 'javascript' || language === 'html');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(code ?? ''));
    } catch {
      const area = document.createElement('textarea');
      area.value = String(code ?? '');
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const run = () => {
    if (language === 'html') {
      setPreview(true);
      return;
    }
    stopRef.current?.();
    setLogs([]);
    setRunning(true);
    stopRef.current = runJavaScript(
      String(code ?? ''),
      (entry) => setLogs((l) => [...(l || []), entry]),
      () => setRunning(false)
    );
  };

  return (
    <figure className={embedded ? '' : 'my-4'}>
      <div className="overflow-hidden rounded-[8px] border border-[#2d2a52]">
        <div className="flex items-center justify-between gap-2 bg-[#2a2754] px-3 py-2 text-[#ece8fb]">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-full bg-[#c9a8ff] px-2.5 py-0.5 text-[0.68em] font-bold uppercase tracking-wide text-[#1b1b3a]">
              {languageLabel(language)}
            </span>
            {filename && <span className="truncate font-mono text-[0.8em] text-[#ece8fb]/80">{filename}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {canRun && (
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="rounded-md bg-[#9be3a8] px-3 py-1 text-[0.78em] font-bold text-[#1b1b3a] hover:brightness-110 disabled:opacity-60"
              >
                {running ? 'Executando…' : '▶ Executar'}
              </button>
            )}
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-white/25 px-3 py-1 text-[0.78em] font-semibold hover:bg-white/10"
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {code && (
          <pre className="code-surface m-0 overflow-x-auto py-3 text-[0.85em] leading-[1.6]">
            <code>
              {lines.map((html, i) => {
                const n = i + 1;
                const on = marked.has(n);
                return (
                  <div
                    key={i}
                    className="flex pr-4"
                    style={on ? { background: 'rgba(201,168,255,.18)', boxShadow: 'inset 3px 0 0 #c9a8ff' } : undefined}
                  >
                    {lineNumbers === 'sim' && (
                      <span className="w-10 shrink-0 select-none pr-3 text-right text-[#8f8ab5]" aria-hidden>{n}</span>
                    )}
                    {lineNumbers !== 'sim' && <span className="w-4 shrink-0" aria-hidden />}
                    <span className="whitespace-pre" dangerouslySetInnerHTML={{ __html: html || ' ' }} />
                  </div>
                );
              })}
            </code>
          </pre>
        )}

        {preview && language === 'html' && (
          <div className="border-t border-[#2d2a52] bg-white">
            <div className="flex items-center justify-between bg-[#2a2754] px-3 py-1.5 text-[0.75em] font-bold uppercase tracking-wide text-[#ece8fb]">
              Resultado
              <button type="button" onClick={() => setPreview(false)} className="font-semibold normal-case underline">Fechar</button>
            </div>
            <iframe title="Resultado do código" sandbox="allow-scripts" srcDoc={String(code ?? '')} className="h-64 w-full border-0 bg-white" />
          </div>
        )}

        {logs && (
          <div className="border-t border-[#2d2a52] bg-[#12122b] px-4 py-3 font-mono text-[0.82em] text-[#ece8fb]">
            <div className="mb-1 text-[0.8em] font-bold uppercase tracking-wide text-[#9be3a8]">Resultado da execução</div>
            {logs.length === 0 && !running && <div className="text-[#8f8ab5]">(sem saída — use console.log para mostrar valores)</div>}
            {logs.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === 'error' ? 'text-[#ff9fb0]' : l.kind === 'warn' ? 'text-[#ffc27a]' : ''}`}>{l.text}</div>
            ))}
          </div>
        )}

        {output && (
          <div className="border-t border-[#2d2a52] bg-[#12122b] px-4 py-3 font-mono text-[0.82em] text-[#ece8fb]">
            <div className="mb-1 text-[0.8em] font-bold uppercase tracking-wide text-[#8ec5ff]">Saída esperada</div>
            <pre className="m-0 whitespace-pre-wrap break-words">{String(output).replace(/\n+$/, '')}</pre>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-center italic text-ink/70" style={{ fontSize: '0.9em' }}>{caption}</figcaption>}
    </figure>
  );
}
