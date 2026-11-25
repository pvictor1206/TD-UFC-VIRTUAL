// Editar listas dentro de um componente (itens de acordeão, linhas de tabela, alternativas...).
// `key` é o campo do componente que guarda a lista; `blank()` cria um item novo.
export function listApi(block, onChange, key, blank) {
  const items = block[key] || [];
  const put = (next) => onChange({ ...block, [key]: next });
  return {
    items,
    put,
    // troca o item inteiro (listas de textos) ...
    setItem: (i, value) => put(items.map((it, j) => (j === i ? value : it))),
    // ... ou só alguns campos dele (listas de objetos)
    patchItem: (i, patch) => put(items.map((it, j) => (j === i ? { ...it, ...patch } : it))),
    add: () => put([...items, blank()]),
    remove: (i) => put(items.filter((_, j) => j !== i)),
    move: (i, dir) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      put(next);
    },
  };
}

// Aceita o link inteiro do vídeo (ou só o código) e guarda apenas o código.
export function parseVideoId(text, source) {
  const t = String(text ?? '').trim();
  if (source === 'drive') {
    const m = t.match(/\/d\/([\w-]+)/) || t.match(/[?&]id=([\w-]+)/);
    return m ? m[1] : t;
  }
  const m = t.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : t;
}
