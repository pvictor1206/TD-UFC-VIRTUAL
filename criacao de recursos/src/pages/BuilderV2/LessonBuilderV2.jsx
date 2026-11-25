import { useEffect, useMemo, useRef, useState } from 'react';
import { LessonRenderer, createBlankLesson, getSectionDefinition, migrateLesson } from '@lesson';
import { BuilderContext } from '../Builder/BuilderContext';
import Canvas from './Canvas';
import LeftPanel from './LeftPanel';
import QuickAdd from './QuickAdd';
import TopBar from './TopBar';
import useAutosave from './useAutosave';
import useFileActions from './useFileActions';
import * as L from './lessonOps';

// Editor Estrutural — Versão 2.
//
// Mesma aula (mesmo JSON) e mesmos componentes da Versão 1, mas numa tela só: a página da aula
// aparece no centro já editável (clique para selecionar, digite nos textos, arraste para
// reorganizar), com a lista de componentes/camadas à esquerda e as propriedades à direita.
// Não existe "modo editar" x "modo pré-visualizar". Uma aula criada em uma versão abre na outra.
//
// Props (as mesmas da Versão 1):
// - initialLesson: aula inicial
// - onLessonChange: chamado a cada alteração (salvamento automático); pode devolver false se falhar
// - loadAssets: devolve { js, css } do pacote standalone (para "Baixar site")
// - headerExtra: conteúdo extra no início do cabeçalho (ex.: botão voltar)
// - readOnly: apenas leitura
// - hideFileActions / hideExample / canEditSpacing / uploadImage: igual à Versão 1

function useToast() {
  const [toast, setToast] = useState(null); // { msg, undo?, after? }
  const timer = useRef(null);
  const notify = (msg, opts = {}) => {
    clearTimeout(timer.current);
    setToast({ msg, ...opts });
    timer.current = setTimeout(() => setToast(null), opts.undo ? 9000 : 4000);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, notify, dismiss: () => setToast(null) };
}

function Toast({ toast, lesson, onUndo }) {
  if (!toast) return null;
  // "Desfazer" só enquanto nada mais mudou na aula (senão voltaria atrás em edições novas)
  const canUndo = toast.undo && toast.after === lesson;
  return (
    <div role="status" className="pointer-events-none absolute inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-xl items-center gap-4 rounded-xl bg-gray-900 px-4 py-2.5 text-sm text-white shadow-xl">
        <span>{toast.msg}</span>
        {canUndo && (
          <button type="button" onClick={onUndo} className="shrink-0 font-bold text-sky-300 underline hover:text-sky-200">
            Desfazer
          </button>
        )}
      </div>
    </div>
  );
}

function ReadOnlyView({ initialLesson, loadAssets, headerExtra, hideFileActions }) {
  const lesson = useMemo(() => migrateLesson({ ...createBlankLesson(), ...initialLesson }), [initialLesson]);
  const { toast, notify } = useToast();
  const files = useFileActions({ lesson, setLesson: () => {}, loadAssets, notify });
  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white font-[Inter] text-ink">
      <TopBar headerExtra={headerExtra} readOnly hideFileActions={hideFileActions} hideExample files={files} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-t-4 border-lav-bar">
          <div className="border-b border-lav-bar bg-lav py-1.5 text-center text-xs font-semibold text-ink">
            Modo leitura — é exatamente assim que a aula vai aparecer para o aluno
          </div>
          <LessonRenderer content={lesson} />
        </div>
      </div>
      <Toast toast={toast} lesson={lesson} />
    </div>
  );
}

function Editor({ initialLesson, onLessonChange, loadAssets, headerExtra, hideFileActions, hideExample, uploadImage, canEditSpacing }) {
  const [lesson, setLesson] = useState(() => migrateLesson({ ...createBlankLesson(), ...initialLesson }));
  // O que está selecionado na página: { kind: 'lesson' } | { kind: 'section', s } | { kind: 'block', s, c } | null
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('components');
  const [showLeft, setShowLeft] = useState(true);
  // componente recém-adicionado: o cursor vai para o primeiro campo dele
  const [focusKey, setFocusKey] = useState(null);
  const scrollRef = useRef(null);
  // o que está sendo arrastado ({ kind: 'block', s, c } | { kind: 'chapter', s }): compartilhado entre a página e as camadas
  const dragRef = useRef(null);
  // janelinha "adicionar componente aqui" ({ rect, s, c, scroll })
  const [quickAdd, setQuickAdd] = useState(null);
  // visão do aluno: mostra a aula pronta, como ela aparece para ele (e volta para a edição no mesmo ponto)
  const [studentView, setStudentView] = useState(false);
  const savedScroll = useRef(0);
  const { toast, notify, dismiss } = useToast();
  const { saveState, flushSave } = useAutosave(lesson, onLessonChange, true);
  const files = useFileActions({ lesson, setLesson, loadAssets, notify });

  // Leva a página até o que foi selecionado (repete por um instante: imagens e textos crescem depois do 1º desenho).
  const scrollToSelection = (sel) => {
    const go = () => {
      const root = scrollRef.current;
      if (!root) return;
      let el = null;
      if (sel.kind === 'block') el = root.querySelector(`[data-s="${sel.s}"][data-c="${sel.c}"]`);
      else if (sel.kind === 'section') el = root.querySelector(`[data-chapter="${sel.s}"]`);
      else el = root.querySelector('[data-lesson-header]');
      if (!el) return;
      const tall = el.getBoundingClientRect().height > root.clientHeight * 0.8;
      el.scrollIntoView({ behavior: 'auto', block: sel.kind === 'block' && !tall ? 'center' : 'start' });
    };
    requestAnimationFrame(() => { go(); requestAnimationFrame(go); });
    setTimeout(go, 150);
    setTimeout(go, 400);
  };

  const select = (sel, scroll = false) => {
    setSelected(sel);
    if (sel && scroll) scrollToSelection(sel);
  };

  const withUndo = (message, next) => {
    setLesson(next);
    notify(message, { undo: lesson, after: next });
  };

  const ops = {
    updateMeta: (key, value) => setLesson((l) => ({ ...l, [key]: value })),
    patchSection: (s, patch) => setLesson((l) => (l.sections[s] ? L.patchSection(l, s, patch) : l)),
    // só aceita a alteração se o componente ainda está no mesmo lugar (evita gravar no vizinho depois de excluir/mover)
    changeBlock: (s, c, block) =>
      setLesson((l) => {
        const cur = l.sections[s]?.children?.[c];
        return cur && cur.type === block.type ? L.updateBlock(l, s, c, block) : l;
      }),

    // `at` = onde soltar ({ s, c }); sem ele, entra abaixo do que está selecionado.
    // A página rola até o componente novo quando não há `at` (ou com opts.scroll, ex.: ao adicionar pelas camadas).
    addBlock: (type, at, opts = {}) => {
      const block = L.newBlock(type);
      if (!block) return;
      let base = lesson;
      let target = at;
      if (base.sections.length === 0) {
        base = L.insertSection(base, 0);
        target = { s: 0, c: 0 };
      } else if (!target) {
        target = L.defaultTarget(base, selected);
      }
      const next = L.insertBlock(base, target.s, target.c, block);
      const sel = { kind: 'block', s: target.s, c: target.c };
      setLesson(next);
      setSelected(sel);
      setFocusKey({ s: target.s, c: target.c });
      if (!at || opts.scroll) scrollToSelection(sel);
      notify(`"${getSectionDefinition(type).label}" adicionado em: ${L.sectionLabel(next.sections[target.s], target.s)}`);
    },
    clearFocus: () => setFocusKey(null),
    removeBlock: (s, c) => {
      withUndo('Componente excluído.', L.removeBlock(lesson, s, c));
      setSelected({ kind: 'section', s });
    },
    duplicateBlock: (s, c) => {
      setLesson(L.duplicateBlock(lesson, s, c));
      select({ kind: 'block', s, c: c + 1 }, true);
    },
    moveBlockBy: (s, c, dir) => {
      setLesson(L.swapBlock(lesson, s, c, dir));
      select({ kind: 'block', s, c: c + dir }, true);
    },
    dropMove: (from, to, opts = {}) => {
      const r = L.moveBlock(lesson, from, to);
      setLesson(r.lesson);
      select({ kind: 'block', ...r.at }, !!opts.scroll);
    },
    // leva um capítulo inteiro para a posição `index` (contada antes de tirá-lo do lugar)
    dropChapter: (from, index, opts = {}) => {
      const r = L.moveSection(lesson, from, index);
      setLesson(r.lesson);
      select({ kind: 'section', s: r.at }, !!opts.scroll);
    },
    openQuickAdd: (rect, at, opts = {}) => setQuickAdd({ rect, ...at, scroll: !!opts.scroll }),

    addSection: () => {
      const at = lesson.sections.length;
      setLesson(L.insertSection(lesson, at));
      select({ kind: 'section', s: at }, true);
    },
    removeSection: (s) => {
      withUndo('Capítulo excluído.', L.removeSection(lesson, s));
      setSelected(null);
    },
    duplicateSection: (s) => {
      setLesson(L.duplicateSection(lesson, s));
      select({ kind: 'section', s: s + 1 }, true);
    },
    moveSectionBy: (s, dir) => {
      setLesson(L.swapSection(lesson, s, dir));
      select({ kind: 'section', s: s + dir }, true);
    },
  };

  const toggleStudentView = () => {
    if (!studentView) savedScroll.current = scrollRef.current?.scrollTop ?? 0;
    setQuickAdd(null);
    setStudentView((v) => !v);
  };
  // ao voltar para a edição, a página reaparece no mesmo ponto em que estava
  useEffect(() => {
    if (studentView) return;
    const top = savedScroll.current;
    requestAnimationFrame(() => { if (scrollRef.current) scrollRef.current.scrollTop = top; });
  }, [studentView]);

  const undo = () => {
    if (!toast?.undo) return;
    setLesson(toast.undo);
    setSelected(null);
    dismiss();
  };

  // Atalhos (com o foco fora de campos de texto): Esc tira a seleção; Delete exclui o componente selecionado.
  useEffect(() => {
    const onKey = (e) => {
      if (studentView) return;
      const t = e.target;
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (!(t === document.body || scrollRef.current?.contains(t))) return;
      if (e.key === 'Escape') setSelected(null);
      // Delete só com o foco "solto" na página (não com o cursor num botão), para não excluir sem querer
      else if (e.key === 'Delete' && t === document.body && selected?.kind === 'block' && lesson.sections[selected.s]?.children?.[selected.c]) {
        e.preventDefault();
        ops.removeBlock(selected.s, selected.c);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, lesson, studentView]);

  return (
    <BuilderContext.Provider value={{ uploadImage, canEditSpacing }}>
      <div className="relative flex h-full min-h-0 flex-col bg-[#ececec] font-[Inter] text-ink">
        <TopBar
          headerExtra={headerExtra}
          hideFileActions={hideFileActions}
          hideExample={hideExample}
          saveState={saveState}
          flushSave={flushSave}
          files={files}
          cor={lesson.cor}
          onCor={(v) => ops.updateMeta('cor', v)}
          panels={{ left: showLeft, toggleLeft: () => setShowLeft((v) => !v) }}
          student={{ on: studentView, toggle: toggleStudentView }}
        />
        <div className="flex min-h-0 flex-1">
          {studentView && (
            <div data-student-view className="min-w-0 flex-1 overflow-y-auto bg-white">
              <div className="sticky top-0 z-20 flex flex-wrap items-center justify-center gap-3 border-b border-lav-bar bg-lav py-1.5 text-xs font-semibold text-ink">
                Visão do aluno — é exatamente assim que a aula vai aparecer para ele
                <button type="button" onClick={toggleStudentView} className="rounded-md bg-white px-2.5 py-1 font-bold underline hover:bg-lav-soft">Voltar a editar</button>
              </div>
              <LessonRenderer content={lesson} />
            </div>
          )}
          {!studentView && showLeft && (
            <LeftPanel
              lesson={lesson}
              selected={selected}
              tab={tab}
              onTab={setTab}
              onSelect={select}
              onAddBlock={(type) => ops.addBlock(type)}
              onAddSection={ops.addSection}
              dragRef={dragRef}
              ops={ops}
            />
          )}
          {!studentView && <Canvas lesson={lesson} selected={selected} focusKey={focusKey} onSelect={select} ops={ops} scrollRef={scrollRef} dragRef={dragRef} />}
        </div>
        <Toast toast={toast} lesson={lesson} onUndo={undo} />
        {quickAdd && lesson.sections[quickAdd.s] && (
          <QuickAdd
            rect={quickAdd.rect}
            title={`Adicionar em: ${L.sectionLabel(lesson.sections[quickAdd.s], quickAdd.s)}`}
            onClose={() => setQuickAdd(null)}
            onPick={(type) => {
              ops.addBlock(type, { s: quickAdd.s, c: quickAdd.c }, { scroll: quickAdd.scroll });
              setQuickAdd(null);
            }}
          />
        )}
      </div>
    </BuilderContext.Provider>
  );
}

export default function LessonBuilderV2({
  initialLesson,
  onLessonChange,
  loadAssets,
  headerExtra,
  readOnly = false,
  hideFileActions = false,
  hideExample = false,
  uploadImage = null,
  canEditSpacing = true,
}) {
  return readOnly ? (
    <ReadOnlyView initialLesson={initialLesson} loadAssets={loadAssets} headerExtra={headerExtra} hideFileActions={hideFileActions} />
  ) : (
    <Editor
      initialLesson={initialLesson}
      onLessonChange={onLessonChange}
      loadAssets={loadAssets}
      headerExtra={headerExtra}
      hideFileActions={hideFileActions}
      hideExample={hideExample}
      uploadImage={uploadImage}
      canEditSpacing={canEditSpacing}
    />
  );
}
