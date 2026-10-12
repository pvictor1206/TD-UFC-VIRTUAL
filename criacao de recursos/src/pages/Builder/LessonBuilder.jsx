import { useEffect, useMemo, useRef, useState } from 'react';
import { LessonRenderer, createBlankLesson, SAMPLE_LESSON, getSectionDefinition, migrateLesson } from '@lesson';
import BlockPalette from './BlockPalette';
import BlockCard from './BlockCard';
import ColorPicker from './ColorPicker';
import { downloadJson, downloadLessonSite, slugify } from './exportSite';

const DRAFT_KEY = 'construtor-de-aulas:rascunho';

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Props opcionais para uso embutido em outra aplicação (ex.: painel EAD):
// - initialLesson: aula inicial (desativa o rascunho em localStorage)
// - onLessonChange: chamado a cada alteração do conteúdo
// - loadAssets: devolve { js, css } do pacote standalone (padrão: fetch)
// - headerExtra: conteúdo extra no início do cabeçalho (ex.: botão voltar)
// - readOnly: apenas pré-visualização, sem edição
// - hideFileActions: oculta Abrir projeto, Salvar projeto e Baixar site
export default function LessonBuilder({ initialLesson, onLessonChange, loadAssets, headerExtra, readOnly = false, hideFileActions = false } = {}) {
  const embedded = initialLesson !== undefined;
  const [lesson, setLesson] = useState(() =>
    migrateLesson(embedded ? { ...createBlankLesson(), ...initialLesson } : loadDraft() || createBlankLesson())
  );
  const [view, setView] = useState(readOnly ? 'preview' : 'editar'); // 'editar' | 'preview'
  const [feedback, setFeedback] = useState('');
  const fileInputRef = useRef(null);
  const firstRun = useRef(true);
  // Índice do bloco recém-criado/duplicado, para rolar a tela até ele
  const [scrollToIndex, setScrollToIndex] = useState(null);

  useEffect(() => {
    if (embedded) {
      if (firstRun.current) {
        firstRun.current = false;
        return undefined;
      }
      const id = setTimeout(() => onLessonChange?.(lesson), 300);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(lesson));
      } catch {
        // localStorage indisponível (modo privado, cota cheia etc.) — ignora silenciosamente
      }
    }, 400);
    return () => clearTimeout(id);
  }, [lesson]);

  useEffect(() => {
    if (scrollToIndex === null) return;
    const el = document.querySelector(`[data-block-index="${scrollToIndex}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScrollToIndex(null);
  }, [scrollToIndex, lesson.sections.length]);

  const flash = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  const updateMeta = (key, value) => setLesson((l) => ({ ...l, [key]: value }));

  // Seção onde os componentes da barra lateral serão adicionados
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSection = Math.min(activeIdx, Math.max(lesson.sections.length - 1, 0));

  const newSectionData = () => getSectionDefinition('section').defaultData();

  // Nova seção (vazia) no fim da aula
  const addEmptySection = () => {
    setScrollToIndex(lesson.sections.length);
    setActiveIdx(lesson.sections.length);
    setLesson((l) => ({ ...l, sections: [...l.sections, newSectionData()] }));
    setView('editar');
  };

  // Componente do menu lateral: o usuário escolhe em qual seção ele entra.
  // (Com uma única seção não há o que escolher: entra direto nela.)
  const [pendingType, setPendingType] = useState(null);

  const sectionLabel = (section, i) => {
    const name = section?.name || section?.title || '';
    return `Seção ${i + 1}${name ? ` — ${name}` : ''}`;
  };

  const addBlockToSection = (type, sectionIndex) => {
    const definition = getSectionDefinition(type);
    if (!definition) return;
    setLesson((l) => {
      const sections = [...l.sections];
      const i = Math.min(sectionIndex, sections.length - 1);
      sections[i] = { ...sections[i], children: [...(sections[i].children || []), definition.defaultData()] };
      return { ...l, sections };
    });
    flash(`"${definition.label}" adicionado em: ${sectionLabel(lesson.sections[sectionIndex], sectionIndex)}`);
    setActiveIdx(sectionIndex);
    setScrollToIndex(sectionIndex);
    setPendingType(null);
    setView('editar');
  };

  const addSection = (type) => {
    if (!getSectionDefinition(type)) return;
    if (lesson.sections.length === 0) {
      flash('Crie uma seção primeiro: clique em "+ Adicionar seção".');
      return;
    }
    if (lesson.sections.length === 1) {
      addBlockToSection(type, 0);
      return;
    }
    setPendingType(type);
  };

  const updateSection = (index, newSection) => {
    setLesson((l) => {
      const sections = [...l.sections];
      sections[index] = newSection;
      return { ...l, sections };
    });
  };

  const removeSection = (index) => {
    setLesson((l) => ({ ...l, sections: l.sections.filter((_, i) => i !== index) }));
  };

  const duplicateSection = (index) => {
    setScrollToIndex(index + 1);
    setActiveIdx(index + 1);
    setLesson((l) => {
      const sections = [...l.sections];
      sections.splice(index + 1, 0, JSON.parse(JSON.stringify(sections[index])));
      return { ...l, sections };
    });
  };

  const moveSection = (index, dir) => {
    setLesson((l) => {
      const j = index + dir;
      if (j < 0 || j >= l.sections.length) return l;
      const sections = [...l.sections];
      [sections[index], sections[j]] = [sections[j], sections[index]];
      setActiveIdx(j);
      return { ...l, sections };
    });
  };

  const handleNew = () => {
    if (!confirm('Isso vai apagar o conteúdo atual do construtor. Deseja continuar?')) return;
    setLesson(createBlankLesson());
    flash('Construtor limpo.');
  };

  const handleLoadSample = () => {
    if (lesson.sections.length > 0 && !confirm('Isso vai substituir o conteúdo atual pelo exemplo. Deseja continuar?')) return;
    setLesson({ ...JSON.parse(JSON.stringify(SAMPLE_LESSON)), cor: lesson.cor || '' });
    flash('Exemplo carregado.');
  };

  const [downloading, setDownloading] = useState(false);
  const [showObjetivo, setShowObjetivo] = useState(true);

  const handleDownloadSite = async () => {
    setDownloading(true);
    try {
      await downloadLessonSite(lesson, loadAssets);
      flash('Site baixado! Descompacte o .zip e abra o index.html.');
    } catch (err) {
      console.error(err);
      flash('Não foi possível gerar o site. Veja o console (F12) para detalhes.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveProject = () => {
    downloadJson(`projeto_${slugify(lesson.titulo)}.json`, lesson);
    flash('Projeto salvo. Use "Abrir projeto" para continuar editando depois.');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setLesson(migrateLesson({ aula: '', titulo: '', objetivo: '', sections: [], ...parsed }));
        flash('Projeto aberto com sucesso.');
      } catch {
        flash('Arquivo inválido: não é um projeto de aula reconhecível.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const sectionCount = lesson.sections.length;
  const previewContent = useMemo(() => lesson, [lesson]);

  return (
    <div className="min-h-screen bg-lav-soft font-[Inter] text-ink">
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-3">
          {headerExtra}
          <div className="flex-1 min-w-[200px]">
            <h1 className="font-bold text-ink text-lg leading-tight">Editor Estrutural</h1>
            <p className="text-xs text-gray-400">Monte o conteúdo da aula com os componentes padrão — sem escrever código.</p>
          </div>

          {!readOnly && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setView('editar')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'editar' ? 'bg-white dark:bg-gray-700 shadow text-blue-700 dark:text-blue-300' : 'text-gray-500'}`}
            >
              ✏️ Editar
            </button>
            <button
              type="button"
              onClick={() => setView('preview')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'preview' ? 'bg-white dark:bg-gray-700 shadow text-blue-700 dark:text-blue-300' : 'text-gray-500'}`}
            >
              👁️ Pré-visualizar
            </button>
          </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {!readOnly && <>
            <button onClick={handleLoadSample} type="button" className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Exemplo</button>
            {!hideFileActions && <button onClick={handleImportClick} type="button" className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Abrir projeto</button>}
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
            </>}
            {!hideFileActions && <button onClick={handleSaveProject} type="button" title="Baixa um arquivo para continuar editando depois" className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Salvar projeto</button>}
            {!hideFileActions && <button onClick={handleDownloadSite} disabled={downloading} type="button" className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60">
              {downloading ? 'Gerando site…' : '⬇ Baixar site'}
            </button>}
            {!readOnly && <button onClick={handleNew} type="button" className="text-xs font-semibold px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">Limpar</button>}
          </div>
        </div>
        {feedback && (
          <div className="max-w-[1600px] mx-auto mt-2 text-xs font-semibold text-ink bg-lav border border-lav-bar rounded-md px-3 py-1.5 inline-block">
            {feedback}
          </div>
        )}
      </header>

      {view === 'preview' ? (
        <div className="border-t-4 border-lav-bar">
          <div className="bg-lav border-b border-lav-bar text-ink text-xs font-semibold text-center py-1.5">
            Modo pré-visualização — é exatamente assim que a aula vai aparecer para o aluno
          </div>
          <LessonRenderer content={previewContent} />
        </div>
      ) : (
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 px-4 md:px-6 py-6">
          <aside className="lg:sticky lg:top-[88px] lg:self-start bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={addEmptySection}
              className="w-full mb-4 rounded-lg bg-blue-700 text-white text-sm font-bold px-3 py-2.5 hover:bg-blue-800 transition-colors"
            >
              + Adicionar seção
            </button>
            <BlockPalette onAdd={addSection} disabled={sectionCount === 0} />
          </aside>

          <main className="space-y-4">
            {/* Dados da aula: barra compacta, fixa no topo ao rolar */}
            <div className="sticky top-[72px] z-20 bg-white/95 backdrop-blur rounded-xl border border-lav shadow-sm px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-blue-600 shrink-0">Aula</span>
                <input
                  type="text"
                  aria-label="Número da aula"
                  title="Número da aula"
                  placeholder="Nº"
                  value={lesson.aula ?? ''}
                  onChange={(e) => updateMeta('aula', e.target.value)}
                  className="w-14 shrink-0 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  aria-label="Título da aula"
                  title="Título da aula"
                  placeholder="Título da aula"
                  value={lesson.titulo ?? ''}
                  onChange={(e) => updateMeta('titulo', e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ColorPicker value={lesson.cor || ''} onChange={(v) => updateMeta('cor', v)} />
                <button
                  type="button"
                  onClick={() => setShowObjetivo((v) => !v)}
                  aria-expanded={showObjetivo}
                  title="Objetivo (subtítulo, opcional)"
                  className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${showObjetivo ? 'bg-lav border-lav-bar text-ink' : 'border-gray-300 text-gray-600 hover:bg-lav-soft'}`}
                >
                  Objetivo{lesson.objetivo ? ' •' : ''} {showObjetivo ? '▴' : '▾'}
                </button>
              </div>
              {showObjetivo && (
                <textarea
                  aria-label="Objetivo (subtítulo, opcional)"
                  placeholder="Objetivo (subtítulo, opcional)"
                  rows={2}
                  value={lesson.objetivo ?? ''}
                  onChange={(e) => updateMeta('objetivo', e.target.value)}
                  className="mt-2 w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                Seções {sectionCount > 0 && <span className="text-gray-400 font-normal">({sectionCount})</span>}
              </h2>
            </div>

            {sectionCount === 0 && (
              <div className="text-center text-sm text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-12">
                Nenhuma seção ainda. Clique em "Adicionar seção" para começar — os componentes ficam dentro dela.
              </div>
            )}

            <div className="space-y-3">
              {lesson.sections.map((section, index) => (
                <div
                  key={index}
                  data-block-index={index}
                  onFocusCapture={() => setActiveIdx(index)}
                  onMouseDownCapture={() => setActiveIdx(index)}
                  className={index === activeSection && sectionCount > 1 ? 'rounded-xl ring-2 ring-blue-300 ring-offset-2' : ''}
                >
                <BlockCard
                  section={section}
                  index={index}
                  total={sectionCount}
                  isActive={index === activeSection && sectionCount > 1}
                  onChange={(s) => updateSection(index, s)}
                  onRemove={() => removeSection(index)}
                  onDuplicate={() => duplicateSection(index)}
                  onMove={(dir) => moveSection(index, dir)}
                />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEmptySection}
              className="w-full rounded-xl border-2 border-dashed border-blue-400 text-blue-700 py-4 text-sm font-bold hover:bg-lav-soft transition-colors"
            >
              + Adicionar seção
            </button>
          </main>
        </div>
      )}

      {pendingType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setPendingType(null); }}
          onKeyDown={(e) => { if (e.key === 'Escape') setPendingType(null); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Escolher seção" className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-5">
            <h2 className="text-base font-bold text-ink">
              Em qual seção adicionar {getSectionDefinition(pendingType)?.icon} {getSectionDefinition(pendingType)?.label}?
            </h2>
            <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-2">
              {lesson.sections.map((sec, i) => (
                <button
                  key={i}
                  type="button"
                  autoFocus={i === activeSection}
                  onClick={() => addBlockToSection(pendingType, i)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-colors hover:bg-lav-soft ${i === activeSection ? 'border-blue-400 bg-lav-soft' : 'border-gray-200'}`}
                >
                  <span className="block text-sm font-bold text-ink">{sectionLabel(sec, i)}</span>
                  <span className="block text-xs text-gray-500">
                    {(sec.children || []).length} componente{(sec.children || []).length === 1 ? '' : 's'}
                    {i === activeSection ? ' · seção selecionada' : ''}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setPendingType(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
