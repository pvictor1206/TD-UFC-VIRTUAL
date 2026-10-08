import React, { useContext, useState } from 'react';
import { Wand2, PlusCircle, Pencil, Eye, Download, FileJson, Send, CheckCircle2, RotateCcw, Trash2, ArrowLeft } from 'lucide-react';
import LessonBuilder from '@builder/LessonBuilder';
import { downloadLessonSite, downloadJson, slugify } from '@builder/exportSite';
import { ActionsContext } from './context';

// Pacote standalone (JS + CSS) usado para gerar o site da aula. Carregado
// sob demanda para não pesar no carregamento inicial do painel.
const loadAssets = async () => {
  const [js, css] = await Promise.all([
    import('@standalone/standalone.js?raw'),
    import('@standalone/standalone.css?raw'),
  ]);
  return { js: js.default, css: css.default };
};

export const RESOURCE_STATUS = {
  rascunho: { label: 'Rascunho', color: 'bg-zinc-100 text-zinc-700 border-zinc-300' },
  enviado: { label: 'Enviado p/ Equipe EAD', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  ajuste: { label: 'Ajuste Necessário', color: 'bg-red-100 text-red-800 border-red-300' },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800 border-green-300' },
};

const formatDate = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

// Tela cheia com o Construtor de Aulas (edição ou somente leitura).
function BuilderOverlay({ resource, readOnly, onClose, onChange }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white">
      <LessonBuilder
        key={resource.id}
        initialLesson={resource.lesson}
        onLessonChange={onChange}
        loadAssets={loadAssets}
        readOnly={readOnly}
        headerExtra={
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-bold px-3 py-2 border border-[#D9CFC6] rounded-xl bg-white hover:bg-zinc-100"
          >
            <ArrowLeft size={14} /> Voltar ao painel
          </button>
        }
      />
    </div>
  );
}

export default function RecursosTab({ discipline, isTecnico, currentUser }) {
  const { addResource, updateResource, removeResource } = useContext(ActionsContext);
  const [openBuilder, setOpenBuilder] = useState(null); // { id, readOnly }
  const [newTitle, setNewTitle] = useState('');
  const [feedbackDraft, setFeedbackDraft] = useState({}); // resourceId -> texto do pedido de ajuste
  const [busy, setBusy] = useState(null);

  const resources = discipline.resources || [];
  const editing = openBuilder && resources.find((r) => r.id === openBuilder.id);

  const handleCreate = (e) => {
    e.preventDefault();
    const title = newTitle.trim() || discipline.title;
    const id = addResource(discipline.id, title);
    setNewTitle('');
    setOpenBuilder({ id, readOnly: false });
  };

  const handleLessonChange = (resource) => (lesson) =>
    updateResource(discipline.id, resource.id, { lesson, lastEditedBy: currentUser.name });

  const handleDownload = async (resource) => {
    setBusy(resource.id);
    try {
      await downloadLessonSite(resource.lesson, loadAssets);
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o site. Veja o console (F12).');
    } finally {
      setBusy(null);
    }
  };

  // O professor só edita/envia os recursos que ele mesmo criou
  const canProfessorEdit = (r) => r.author === currentUser.name && (r.status === 'rascunho' || r.status === 'ajuste');

  if (editing) {
    return (
      <BuilderOverlay
        resource={editing}
        readOnly={openBuilder.readOnly}
        onClose={() => setOpenBuilder(null)}
        onChange={handleLessonChange(editing)}
      />
    );
  }

  const btn = 'px-3 py-1.5 text-xs font-bold border border-[#D9CFC6] rounded-xl flex items-center gap-1 transition-colors';

  return (
    <div className="max-w-4xl">
      <h3 className="text-xl font-bold mb-2">Construtor de Aulas</h3>
      <p className="text-sm text-zinc-600 mb-6">
        {isTecnico
          ? 'Crie recursos você mesmo ou acompanhe os do professor: visualize, edite o conteúdo, baixe o site pronto e aprove ou peça ajustes.'
          : 'Monte a sua aula com os componentes padrão (acordeões, cards, quiz, tabelas…). Ao terminar, envie para a Equipe EAD analisar.'}
      </p>

      {(
        <form onSubmit={handleCreate} className="bg-white p-6 border border-[#D9CFC6] rounded-xl mb-8 shadow-sm">
          <h4 className="font-bold mb-2 text-[#991F50] flex items-center gap-2">
            <Wand2 size={18} /> Criar novo recurso
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={`Título da aula (ex: ${discipline.title} — Aula 1)`}
              className="flex-1 border border-[#D9CFC6] rounded-xl p-2.5 focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm"
            />
            <button type="submit" className="bg-iuvi-roxo text-white px-6 py-2.5 font-bold flex items-center gap-2 hover:bg-iuvi-roxo-medio text-sm shrink-0">
              <PlusCircle size={18} /> Criar e abrir construtor
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {resources.length === 0 ? (
          <p className="text-zinc-500 italic">
            {isTecnico ? 'O professor ainda não criou nenhum recurso nesta disciplina.' : 'Você ainda não criou nenhum recurso.'}
          </p>
        ) : (
          resources.map((r) => {
            const st = RESOURCE_STATUS[r.status] || RESOURCE_STATUS.rascunho;
            const blocks = r.lesson?.sections?.length || 0;
            const profCanEdit = !isTecnico && canProfessorEdit(r);
            return (
              <div key={r.id} className="bg-white p-5 border border-[#D9CFC6] rounded-xl">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div>
                    <h5 className="font-bold text-lg text-zinc-900">{r.lesson?.titulo || 'Aula sem título'}</h5>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500">
                      <span>Autor: <strong>{r.author}</strong></span>
                      <span>•</span>
                      <span>{blocks} bloco{blocks === 1 ? '' : 's'}</span>
                      <span>•</span>
                      <span>Atualizado em {formatDate(r.updatedAt)}</span>
                      {r.lastEditedBy && r.lastEditedBy !== r.author && (
                        <>
                          <span>•</span>
                          <span>Última edição: <strong>{r.lastEditedBy}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 border font-bold text-[10px] uppercase shrink-0 ${st.color}`}>{st.label}</span>
                </div>

                {r.status === 'ajuste' && r.feedback && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 mb-3 whitespace-pre-wrap">
                    <strong className="block text-[10px] uppercase tracking-wider mb-1">Retorno da Equipe EAD</strong>
                    {r.feedback}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {(isTecnico || profCanEdit) && (
                    <button onClick={() => setOpenBuilder({ id: r.id, readOnly: false })} className={`${btn} bg-[#991F50] text-white hover:bg-[#801436]`}>
                      <Pencil size={14} /> Editar conteúdo
                    </button>
                  )}
                  <button onClick={() => setOpenBuilder({ id: r.id, readOnly: true })} className={`${btn} bg-white hover:bg-zinc-100`}>
                    <Eye size={14} /> Visualizar
                  </button>

                  {profCanEdit && (
                    <button
                      onClick={() => updateResource(discipline.id, r.id, { status: 'enviado', feedback: '' })}
                      disabled={blocks === 0}
                      title={blocks === 0 ? 'Adicione ao menos um bloco antes de enviar' : ''}
                      className={`${btn} bg-green-600 text-white hover:bg-green-700 disabled:opacity-50`}
                    >
                      <Send size={14} /> Enviar para a Equipe EAD
                    </button>
                  )}
                  {!isTecnico && r.status === 'enviado' && (
                    <button onClick={() => updateResource(discipline.id, r.id, { status: 'rascunho' })} className={`${btn} bg-white hover:bg-zinc-100`}>
                      <RotateCcw size={14} /> Recolher p/ editar
                    </button>
                  )}

                  {isTecnico && (
                    <>
                      <button onClick={() => handleDownload(r)} disabled={busy === r.id} className={`${btn} bg-white hover:bg-zinc-100 disabled:opacity-50`}>
                        <Download size={14} /> {busy === r.id ? 'Gerando…' : 'Baixar site (.zip)'}
                      </button>
                      <button
                        onClick={() => downloadJson(`projeto_${slugify(r.lesson?.titulo)}.json`, r.lesson)}
                        className={`${btn} bg-white hover:bg-zinc-100`}
                      >
                        <FileJson size={14} /> Baixar projeto (.json)
                      </button>
                      <button
                        onClick={() => updateResource(discipline.id, r.id, { status: 'aprovado', feedback: '' })}
                        className={`${btn} bg-green-600 text-white hover:bg-green-700`}
                      >
                        <CheckCircle2 size={14} /> Aprovar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Excluir este recurso definitivamente?')) removeResource(discipline.id, r.id);
                        }}
                        className={`${btn} bg-white text-red-600 hover:bg-red-50`}
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </>
                  )}
                </div>

                {isTecnico && (
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                      Pedir ajuste ao professor
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={feedbackDraft[r.id] || ''}
                        onChange={(e) => setFeedbackDraft({ ...feedbackDraft, [r.id]: e.target.value })}
                        placeholder="Descreva o que precisa ser ajustado…"
                        className="flex-1 border border-[#D9CFC6] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                      />
                      <button
                        disabled={!(feedbackDraft[r.id] || '').trim()}
                        onClick={() => {
                          updateResource(discipline.id, r.id, { status: 'ajuste', feedback: feedbackDraft[r.id].trim() });
                          setFeedbackDraft({ ...feedbackDraft, [r.id]: '' });
                        }}
                        className="bg-red-600 text-white px-4 py-1.5 text-xs font-bold hover:bg-red-700 disabled:opacity-50 shrink-0"
                      >
                        Solicitar ajuste
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
