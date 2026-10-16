import React, { useState, useEffect, useContext } from 'react';
import RecursosTab from './RecursosTab';
import { IuviLogo, UfcLogo, PatternStrip } from './Brand';
import { ActionsContext } from './context';
import { supabase } from './supabase';
import * as db from './db';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  FileText, 
  AlertCircle, 
  LogOut, 
  UploadCloud,
  CheckCircle2,
  Circle,
  MessageSquare,
  Users,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Send,
  UserPlus,
  PlusCircle,
  Trash2,
  FolderPlus,
  Lock,
  Wand2,
  PlayCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// --- PERFIS E EQUIPES ---
// Perfis: 'admin' (Administrador), 'tecnico' (Suporte técnico) e 'conteudista' (Professor).
// O administrador cria equipes; cada equipe tem suportes técnicos e conteudistas (profile.teamId).
// Todos os suportes técnicos de uma equipe veem as disciplinas e os conteudistas dela, e de nenhuma outra.
// Os dados ficam no Supabase (ver supabase/schema.sql); as regras de acesso são aplicadas pelo próprio banco.

const KANBAN_STAGES = [
  { id: 'recebimento', title: 'Recebimento' },
  { id: 'design_educacional', title: 'Design Educacional' },
  { id: 'producao', title: 'Produção Audiovisual/Gráfica' },
  { id: 'revisao', title: 'Revisão Final' },
  { id: 'implantado', title: 'Implantado no AVA' }
];

  // --- KANBAN COM CONTROLE DE IDA E VOLTA ---
  const KanbanTab = ({ discipline, isTecnico }) => {
    const { moveStage, setStageDone, addTask, updateTask, removeTask } = useContext(ActionsContext);
    const currentStageIndex = KANBAN_STAGES.findIndex(s => s.id === discipline.stage);
    const tasks = discipline.tasks || [];

    // formulário de nova tarefa (uma etapa por vez)
    const [addingStage, setAddingStage] = useState(null);
    const [draft, setDraft] = useState({ title: '', description: '', dueDate: '' });
    const closeForm = () => { setAddingStage(null); setDraft({ title: '', description: '', dueDate: '' }); };
    const submitTask = (e, stageId) => {
      e.preventDefault();
      if (!draft.title.trim()) return;
      addTask(discipline.id, { ...draft, title: draft.title.trim(), stage: stageId });
      closeForm();
    };
    const formatDue = (iso) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : '');

    return (
      <div className="w-full">
        <h3 className="text-xl font-bold mb-6">Etapas de Implantação EAD</h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage, index) => {
            const isCurrent = discipline.stage === stage.id;
            const isPast = index < currentStageIndex;
            // etapas anteriores contam como concluídas, a menos que desmarcadas; as demais, só se marcadas
            const isDone = discipline.stageDone && stage.id in discipline.stageDone ? !!discipline.stageDone[stage.id] : isPast;
            
            return (
              <div key={stage.id} className="min-w-[290px] w-72 flex-shrink-0 flex flex-col">
                <div className={`
                  p-4 border-2 flex items-center justify-between mb-3
                  ${isCurrent ? 'border-iuvi bg-white shadow-sm' : 
                    isPast ? 'border-zinc-300 bg-zinc-100 text-zinc-500' : 
                    'border-zinc-200 bg-white/50 text-zinc-400 dashed'}
                `}>
                  <span className="font-bold text-sm">{stage.title}</span>
                  {isCurrent && <div className="w-3 h-3 bg-[#FBEEF3]0 rounded-full animate-pulse"></div>}
                  {isDone && <CheckCircle2 size={20} className="text-green-600 shrink-0" aria-label="Etapa concluída" />}
                </div>

                {/* Botão de check: marcar / desmarcar a etapa como concluída */}
                {isTecnico && (
                  <button
                    type="button"
                    onClick={() => setStageDone(discipline.id, stage.id, !isDone)}
                    aria-pressed={isDone}
                    title={isDone ? 'Clique para desmarcar esta etapa' : 'Clique para marcar esta etapa como concluída'}
                    className={`mb-3 w-full flex items-center justify-center gap-2 rounded-xl border-2 py-2 text-sm font-bold transition-colors ${
                      isDone
                        ? 'border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700'
                        : 'border-green-600 bg-white text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    {isDone ? 'Etapa concluída' : 'Marcar como concluída'}
                  </button>
                )}

                {/* Tarefas desta etapa */}
                {(() => {
                  const stageTasks = tasks.filter(t => t.stage === stage.id);
                  const doneCount = stageTasks.filter(t => t.done).length;
                  return (
                    <div className="mb-3 space-y-2">
                      {stageTasks.length > 0 && (
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">
                          Tarefas · {doneCount}/{stageTasks.length} concluída{doneCount === 1 ? '' : 's'}
                        </div>
                      )}
                      {stageTasks.map(t => (
                        <div key={t.id} className={`bg-white border rounded-xl p-3 text-sm ${t.done ? 'border-green-200 bg-green-50/50' : 'border-[#D9CFC6]'}`}>
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={!!t.done}
                              disabled={!isTecnico}
                              onChange={(e) => updateTask(discipline.id, t.id, { done: e.target.checked })}
                              aria-label={`Concluir tarefa: ${t.title}`}
                              className="mt-1 h-4 w-4 accent-[#991F50] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className={`font-semibold break-words ${t.done ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>{t.title}</p>
                              {t.description && <p className="text-xs text-zinc-600 mt-0.5 whitespace-pre-line break-words">{t.description}</p>}
                              <p className="text-[10px] text-zinc-500 mt-1">
                                {t.createdBy}{t.dueDate ? ` · prazo ${formatDue(t.dueDate)}` : ''}
                              </p>
                            </div>
                          </div>
                          {isTecnico && (
                            <div className="flex items-center justify-end gap-1 mt-2">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => updateTask(discipline.id, t.id, { stage: KANBAN_STAGES[index - 1].id })}
                                title="Mover tarefa para a etapa anterior"
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                              ><ArrowLeft size={14} /></button>
                              <button
                                type="button"
                                disabled={index === KANBAN_STAGES.length - 1}
                                onClick={() => updateTask(discipline.id, t.id, { stage: KANBAN_STAGES[index + 1].id })}
                                title="Mover tarefa para a próxima etapa"
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                              ><ArrowRight size={14} /></button>
                              <button
                                type="button"
                                onClick={() => { if (confirm('Excluir esta tarefa?')) removeTask(discipline.id, t.id); }}
                                title="Excluir tarefa"
                                className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                              ><Trash2 size={14} /></button>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTecnico && (addingStage === stage.id ? (
                        <form onSubmit={(e) => submitTask(e, stage.id)} className="bg-white border border-iuvi rounded-xl p-3 space-y-2">
                          <input
                            autoFocus
                            required
                            type="text"
                            value={draft.title}
                            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                            placeholder="Título da tarefa"
                            aria-label="Título da tarefa"
                            className="w-full p-2 border border-[#D9CFC6] rounded-lg text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                          />
                          <textarea
                            rows={2}
                            value={draft.description}
                            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                            placeholder="Descrição (opcional)"
                            aria-label="Descrição da tarefa"
                            className="w-full p-2 border border-[#D9CFC6] rounded-lg text-sm resize-y focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                          />
                          <label className="flex items-center justify-between gap-2 text-xs text-zinc-600">
                            Prazo (opcional)
                            <input
                              type="date"
                              value={draft.dueDate}
                              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                              className="p-1.5 border border-[#D9CFC6] rounded-lg text-sm"
                            />
                          </label>
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 py-2 bg-[#991F50] hover:bg-[#801436] text-white text-sm font-bold rounded-lg transition-colors">Criar tarefa</button>
                            <button type="button" onClick={closeForm} className="px-3 py-2 border border-[#D9CFC6] rounded-lg text-sm font-bold hover:bg-zinc-100">Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setAddingStage(stage.id); setDraft({ title: '', description: '', dueDate: '' }); }}
                          className="w-full py-2 border-2 border-dashed border-[#D9CFC6] rounded-xl text-sm font-bold text-[#991F50] hover:bg-[#FBEEF3] transition-colors flex items-center justify-center gap-1"
                        >
                          <PlusCircle size={16} /> Nova tarefa
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {/* Controle exclusivo da equipe técnica */}
                {isCurrent && (
                  <div className="bg-white border border-[#D9CFC6] rounded-xl p-4 relative">
                    <div className="text-sm mb-4">
                      <strong>Fase Ativa</strong>
                      <p className="text-zinc-600 mt-1">
                        {isTecnico 
                          ? 'Ajuste ou avance a disciplina para refletir o status real de produção.' 
                          : 'A equipe técnica está trabalhando nesta etapa.'}
                      </p>
                    </div>

                    {isTecnico && (
                      <div className="space-y-2">
                        {index < KANBAN_STAGES.length - 1 && (
                          <button 
                            onClick={() => moveStage(discipline.id, KANBAN_STAGES[index + 1].id, stage.id)}
                            className="w-full py-2 bg-[#991F50] hover:bg-[#801436] text-white text-sm font-bold border border-[#D9CFC6] rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                          >
                            Avançar <ArrowRight size={16} />
                          </button>
                        )}
                        {index > 0 && (
                          <button 
                            onClick={() => moveStage(discipline.id, KANBAN_STAGES[index - 1].id)}
                            className="w-full py-2 bg-white text-black border border-[#D9CFC6] rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-1"
                          >
                            <ArrowLeft size={16} /> Retornar Etapa
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- MATERIAIS COM CONTROLE DE STATUS ---
  const MaterialsTab = ({ discipline, isTecnico }) => {
    const { addMaterial, changeMaterialStatus } = useContext(ActionsContext);
    const [newFileName, setNewFileName] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [sending, setSending] = useState(false);

    const handleUpload = async (e) => {
      e.preventDefault();
      const name = newFileName.trim() || newFile?.name || '';
      if (!name) return;
      setSending(true);
      await addMaterial(discipline.id, name, newFile);
      setSending(false);
      setNewFileName('');
      setNewFile(null);
      const input = document.getElementById('material-file');
      if (input) input.value = '';
    };

    const openMaterial = async (file) => {
      try {
        if (file.storagePath) window.open(await db.materialUrl(file.storagePath), '_blank', 'noopener');
        else if (/^https?:\/\//i.test(file.name)) window.open(file.name, '_blank', 'noopener');
      } catch (err) {
        alert(err.message);
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'recebido':
          return { label: 'Recebido / Aprovado', color: 'bg-green-100 text-green-800 border-green-300' };
        case 'ajuste':
          return { label: 'Ajuste Necessário', color: 'bg-red-100 text-red-800 border-red-300' };
        case 'aguandando_analise':
        default:
          return { label: 'Aguardando Análise', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      }
    };

    return (
      <div className="max-w-4xl">
        <h3 className="text-xl font-bold mb-6">Arquivos e Materiais</h3>

        {/* Formulário de Envio */}
        <div className="bg-white p-6 border border-[#D9CFC6] rounded-xl mb-8 shadow-sm">
          <h4 className="font-bold mb-2 text-[#991F50]">Enviar novo material para transição</h4>
          <p className="text-sm text-zinc-600 mb-4">Envie o arquivo (PDF, DOCX, imagens, ZIP…) ou cole o link do Google Drive para o suporte técnico analisar.</p>
          <form onSubmit={handleUpload} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="material-file"
                type="file"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                aria-label="Arquivo do material"
                className="flex-1 border border-[#D9CFC6] rounded-xl p-2 text-sm bg-[#F8F5F1]/30 file:mr-3 file:rounded-lg file:border-0 file:bg-[#FBEEF3] file:px-3 file:py-1.5 file:font-bold file:text-[#991F50]"
              />
              <button
                type="submit"
                disabled={sending || (!newFile && !newFileName.trim())}
                className="bg-iuvi-roxo text-white px-6 py-2.5 font-bold flex items-center justify-center gap-2 hover:bg-iuvi-roxo-medio transition-colors text-sm shrink-0 disabled:opacity-50"
              >
                <UploadCloud size={18} />
                {sending ? 'Enviando…' : 'Enviar Material'}
              </button>
            </div>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={newFile ? 'Nome do material (opcional — por padrão usa o nome do arquivo)' : 'Ou cole um link (Google Drive) / nome do material'}
              className="w-full border border-[#D9CFC6] rounded-xl p-2.5 focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm bg-[#F8F5F1]/30 font-medium"
            />
          </form>
        </div>

        {/* Lista de Materiais */}
        <div className="space-y-4">
          {discipline.materials.length === 0 ? (
            <p className="text-zinc-500 italic">Nenhum material adicionado ainda.</p>
          ) : (
            discipline.materials.map(file => {
              const statusInfo = getStatusLabel(file.status);
              return (
                <div key={file.id} className="bg-white p-4 border border-[#D9CFC6] rounded-xl hover:border-iuvi transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#FBEEF3] p-3 text-[#991F50] border border-zinc-300 shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-base text-zinc-900 break-all">{file.name}</h5>
                      {(file.storagePath || /^https?:\/\//i.test(file.name)) && (
                        <button type="button" onClick={() => openMaterial(file)} className="mt-1 text-xs font-bold text-[#991F50] underline hover:text-[#801436]">
                          {file.storagePath ? 'Baixar arquivo' : 'Abrir link'}
                        </button>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500">
                        <span>Enviado por: <strong>{file.sender}</strong></span>
                        <span>•</span>
                        <span>{new Date(file.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 border font-bold text-[10px] uppercase ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gerenciamento de Status para Equipe Técnica */}
                  {isTecnico ? (
                    <div className="flex flex-col gap-1.5 shrink-0 bg-zinc-50 p-3 border border-zinc-200">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Aprovação do Material:</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => changeMaterialStatus(discipline.id, file.id, 'recebido')}
                          className={`px-3 py-1 text-xs font-bold border ${file.status === 'recebido' ? 'bg-[#991F50] text-white border-iuvi' : 'bg-white border-zinc-300 hover:border-iuvi'}`}
                        >
                          Aprovado
                        </button>
                        <button 
                          onClick={() => changeMaterialStatus(discipline.id, file.id, 'ajuste')}
                          className={`px-3 py-1 text-xs font-bold border ${file.status === 'ajuste' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-zinc-300 hover:border-red-600'}`}
                        >
                          Pedir Ajuste
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right text-xs text-zinc-400 italic font-medium px-2">
                      Somente a Equipe EAD pode aprovar materiais.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // --- PENDÊNCIAS COM SUB-PERFIS E FÓRUM DE DISCUSSÃO ---
  const PendenciesTab = ({ discipline, isTecnico }) => {
    const { addPendency, resolvePendency, addCommentToPendency } = useContext(ActionsContext);
    const [newPendencyText, setNewPendencyText] = useState('');
    const [subTab, setSubTab] = useState('tecnico_para_professor'); // tecnico_para_professor ou professor_para_tecnico
    const [commentInputs, setCommentInputs] = useState({});

    const handleAddPendency = (e) => {
      e.preventDefault();
      if(newPendencyText.trim() === '') return;
      
      const type = isTecnico ? 'tecnico_para_professor' : 'professor_para_tecnico';
      addPendency(discipline.id, newPendencyText, type);
      setNewPendencyText('');
    };

    const handleCommentSubmit = (e, pendencyId) => {
      e.preventDefault();
      const text = commentInputs[pendencyId] || '';
      addCommentToPendency(discipline.id, pendencyId, text);
      setCommentInputs({ ...commentInputs, [pendencyId]: '' });
    };

    const handleCommentChange = (pendencyId, text) => {
      setCommentInputs({ ...commentInputs, [pendencyId]: text });
    };

    const filteredPendencies = discipline.pendencies.filter(p => p.type === subTab);

    return (
      <div className="max-w-4xl">
        <h3 className="text-xl font-bold mb-4">Gestão de Pendências & Ajustes</h3>

        {/* Abas Alternáveis das Categorias de Pendência */}
        <div className="flex gap-2 mb-6 bg-white p-1 border border-[#D9CFC6] rounded-xl">
          <button 
            onClick={() => setSubTab('tecnico_para_professor')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors ${subTab === 'tecnico_para_professor' ? 'bg-[#991F50] text-white' : 'hover:bg-zinc-100 text-zinc-600'}`}
          >
            Ajustes Solicitados pela Equipe Técnica (ao Prof.)
          </button>
          <button 
            onClick={() => setSubTab('professor_para_tecnico')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors ${subTab === 'professor_para_tecnico' ? 'bg-[#991F50] text-white' : 'hover:bg-zinc-100 text-zinc-600'}`}
          >
            Solicitações de Ajuste do Professor (à Equipe)
          </button>
        </div>

        {/* Formulário Contextual */}
        {((subTab === 'tecnico_para_professor' && isTecnico) || (subTab === 'professor_para_tecnico' && !isTecnico)) ? (
          <form onSubmit={handleAddPendency} className="bg-white p-6 border border-[#D9CFC6] rounded-xl mb-8 shadow-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-[#991F50]">
              <AlertCircle size={18} />
              Criar Nova Solicitação de Ajuste
            </h4>
            <textarea 
              value={newPendencyText}
              onChange={(e) => setNewPendencyText(e.target.value)}
              placeholder={isTecnico 
                ? "Ex: Por favor, revise o áudio do vídeo da Aula 2 ou envie o gabarito das questões."
                : "Ex: Solicito alteração no slide de apresentação do Módulo de Introdução por um modelo novo."
              }
              className="w-full border border-[#D9CFC6] rounded-xl p-3 min-h-[90px] mb-4 text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 resize-y"
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-iuvi-roxo text-white px-6 py-2.5 font-bold hover:bg-iuvi-roxo-medio transition-colors text-sm"
              >
                Registrar Solicitação
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#FBEEF3]/50 p-4 border border-[#F0CFDB] text-xs text-zinc-600 mb-6 italic">
            {subTab === 'tecnico_para_professor' 
              ? 'Somente integrantes da Equipe Técnica podem criar novas solicitações nesta seção de pendências.' 
              : 'Somente o Professor Conteudista pode solicitar ajustes no material nesta aba.'
            }
          </div>
        )}

        {/* Lista de Solicitações */}
        <div className="space-y-6">
          {filteredPendencies.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-zinc-300 bg-white/50">
              <CheckCircle2 size={40} className="mx-auto mb-2 text-zinc-400" />
              <p className="text-zinc-500 font-bold text-sm">Não há pendências ativas nesta categoria.</p>
            </div>
          ) : (
            filteredPendencies.map(pendency => (
              <div 
                key={pendency.id} 
                className={`bg-white border border-[#D9CFC6] rounded-xl p-6 ${pendency.status === 'resolvida' ? 'opacity-85' : ''}`}
              >
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Abertura:</span>
                    <strong className="text-sm text-zinc-800">{pendency.author}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 border ${pendency.status === 'aberta' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'}`}>
                      {pendency.status.toUpperCase()}
                    </span>
                    
                    {pendency.status === 'aberta' && (
                      <button 
                        onClick={() => resolvePendency(discipline.id, pendency.id)}
                        className="bg-iuvi-roxo text-white px-3 py-1 text-xs font-bold hover:bg-iuvi-roxo-medio flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={14} /> Resolvido
                      </button>
                    )}
                  </div>
                </div>

                {/* Descrição Principal */}
                <p className="text-zinc-800 text-sm font-medium whitespace-pre-wrap bg-zinc-50 p-4 border border-zinc-200 mb-6">
                  {pendency.text}
                </p>

                {/* Comentários/Conversas */}
                <div className="border-t border-zinc-200 pt-4">
                  <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-3 flex items-center gap-1">
                    <MessageSquare size={14} /> Histórico de Respostas ({pendency.comments.length})
                  </h5>

                  <div className="space-y-3 mb-4">
                    {pendency.comments.map(c => (
                      <div key={c.id} className="bg-[#F8F5F1] p-3 text-sm border border-zinc-200">
                        <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-bold">
                          <span>{c.author}</span>
                          <span>{c.date}</span>
                        </div>
                        <p className="text-zinc-800 font-medium">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Formulário de Resposta no Fórum */}
                  {pendency.status === 'aberta' ? (
                    <form onSubmit={(e) => handleCommentSubmit(e, pendency.id)} className="flex gap-2">
                      <input 
                        type="text" 
                        value={commentInputs[pendency.id] || ''}
                        onChange={(e) => handleCommentChange(pendency.id, e.target.value)}
                        placeholder="Responder no fórum da pendência..."
                        className="flex-1 border border-[#D9CFC6] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                      />
                      <button 
                        type="submit"
                        className="bg-iuvi-roxo hover:bg-iuvi-roxo-medio text-white px-4 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Send size={12} /> Responder
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">Esta pendência foi finalizada e o fórum arquivado.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [booting, setBooting] = useState(true); // verificando se já existe sessão
  const [loggingIn, setLoggingIn] = useState(false);
  const loadedUserRef = React.useRef(null);

  const applyData = (data) => {
    setTeams(data.teams);
    setUsers(data.users);
    setDisciplines(data.disciplines);
  };

  // Recarrega tudo o que o usuário logado pode ver.
  const refresh = async () => {
    try {
      applyData(await db.loadAll());
    } catch (err) {
      console.error(err);
    }
  };

  // Executa uma gravação; em caso de erro avisa e devolve undefined. Por padrão recarrega os dados depois.
  const run = async (fn, reload = true) => {
    try {
      const result = await fn();
      if (reload) await refresh();
      return result;
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Algo deu errado. Tente de novo.');
      await refresh();
      return undefined;
    }
  };

  // Sessão: mantém o login entre visitas e carrega os dados do usuário.
  useEffect(() => {
    let alive = true;
    const boot = async (userId) => {
      try {
        if (!userId) { loadedUserRef.current = null; setCurrentUser(null); return; }
        if (loadedUserRef.current === userId) return;
        const profile = await db.fetchProfile(userId);
        if (!alive) return;
        if (!profile) {
          await db.signOut();
          setLoginError('Este acesso ainda não tem perfil no painel. Fale com o administrador.');
          return;
        }
        const data = await db.loadAll();
        if (!alive) return;
        loadedUserRef.current = userId;
        applyData(data);
        setCurrentUser(profile);
      } catch (err) {
        console.error(err);
        setLoginError(err?.message || 'Não foi possível carregar os dados.');
      } finally {
        if (alive) setBooting(false);
      }
    };
    supabase.auth.getSession().then(({ data }) => boot(data.session?.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      // fora do callback para não travar o cliente de autenticação
      if (event === 'SIGNED_IN') setTimeout(() => boot(session?.user?.id), 0);
      if (event === 'SIGNED_OUT') {
        setTimeout(() => {
          loadedUserRef.current = null;
          setCurrentUser(null); setUsers([]); setTeams([]); setDisciplines([]);
          setActiveDisciplineId(null); setSidebarTab('dashboard');
        }, 0);
      }
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  // Tempo real: quando alguém muda algo, a tela atualiza sozinha.
  useEffect(() => {
    if (!currentUser) return undefined;
    let timer;
    const schedule = () => { clearTimeout(timer); timer = setTimeout(refresh, 600); };
    const channel = supabase.channel('painel-' + currentUser.id);
    ['teams', 'profiles', 'disciplines', 'tasks', 'materials', 'pendencies', 'pendency_comments', 'resources'].forEach((table) => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (table === 'resources' && payload?.new?.last_edited_by === currentUser.id) return; // ecos da própria edição
        schedule();
      });
    });
    channel.subscribe();
    return () => { clearTimeout(timer); supabase.removeChannel(channel); };
  }, [currentUser?.id]);

  // Controle de Navegação e Modais
  const [activeDisciplineId, setActiveDisciplineId] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban'); // kanban, materiais, pendencias
  const [sidebarTab, setSidebarTab] = useState('dashboard'); // dashboard, professores, disciplinas
  
  // Login simulado
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false); // aviso "Deseja sair do sistema?"

  useEffect(() => {
    if (!confirmLogout) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setConfirmLogout(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmLogout]);

  useEffect(() => {
    if (!guideOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setGuideOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guideOpen]);

  // Formulários Administrativos
  const [newProfName, setNewProfName] = useState('');
  const [newProfUser, setNewProfUser] = useState('');
  const [newProfPass, setNewProfPass] = useState('');

  // Equipes (administrador)
  const [newTeamName, setNewTeamName] = useState('');
  const [memberTeamId, setMemberTeamId] = useState(null); // equipe com o formulário de membro aberto
  const [memberDraft, setMemberDraft] = useState({ name: '', username: '', password: '', role: 'tecnico' });
  const [pwEditId, setPwEditId] = useState(null); // membro cuja senha está sendo alterada
  const [pwValue, setPwValue] = useState('');
  const teamName = (id) => teams.find(t => t.id === id)?.name || '—';
  
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscTeacherId, setNewDiscTeacherId] = useState('');
  const [newDiscTeamId, setNewDiscTeamId] = useState(''); // administrador escolhe a equipe; o suporte técnico usa a própria

  // Professores que o usuário logado pode ver: o administrador vê todos;
  // o suporte técnico vê os conteudistas da própria equipe (e de nenhuma outra).
  const getVisibleProfessors = () => {
    if (!currentUser) return [];
    const professors = users.filter(u => u.role === 'conteudista');
    if (currentUser.role === 'admin') return professors;
    if (currentUser.role === 'tecnico') return professors.filter(u => u.teamId === currentUser.teamId);
    return [];
  };

  // Filtra as disciplinas com base no papel do usuário logado
  const getVisibleDisciplines = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'tecnico') {
      const mine = new Set(getVisibleProfessors().map(u => u.id));
      return disciplines.filter(d => mine.has(d.conteudistaId));
    }
    if (currentUser.role === 'admin') return disciplines;
    return disciplines.filter(d => d.conteudistaId === currentUser.id);
  };

  const activeDiscipline = disciplines.find(d => d.id === activeDisciplineId);

  // --- AÇÕES (gravam no Supabase) ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await db.signIn(loginUsername, loginPassword);
      setLoginUsername('');
      setLoginPassword('');
      setActiveDisciplineId(null);
      setSidebarTab('dashboard');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await db.signOut();
  };

  // Suporte técnico cadastra conteudistas da própria equipe
  const handleCreateProfessor = async (e) => {
    e.preventDefault();
    if (!newProfName || !newProfUser || !newProfPass) return;
    const ok = await run(() => db.createMember({
      name: newProfName, username: newProfUser, password: newProfPass, role: 'conteudista', teamId: currentUser.teamId,
    }));
    if (ok) { setNewProfName(''); setNewProfUser(''); setNewProfPass(''); }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const name = newTeamName.trim();
    if (!name) return;
    const team = await run(() => db.createTeam(name));
    if (team) {
      setNewTeamName('');
      setMemberTeamId(team.id); // já abre o cadastro de membros da nova equipe
      setMemberDraft({ name: '', username: '', password: '', role: 'tecnico' });
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    const d = memberDraft;
    if (!d.name.trim() || !d.username.trim() || !d.password) return;
    const ok = await run(() => db.createMember({
      name: d.name.trim(), username: d.username.trim(), password: d.password, role: d.role, teamId: memberTeamId,
    }));
    if (ok) setMemberDraft({ name: '', username: '', password: '', role: d.role });
  };

  // Administrador define uma nova senha para um suporte técnico ou conteudista
  const handleChangePassword = async (e, user) => {
    e.preventDefault();
    if (pwValue.length < 6) { alert('A senha precisa ter pelo menos 6 caracteres.'); return; }
    const ok = await run(() => db.setMemberPassword(user.id, pwValue), false);
    if (ok) {
      setPwEditId(null);
      setPwValue('');
      alert('Senha de ' + user.name + ' alterada. Informe a nova senha à pessoa.');
    }
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    if (!newDiscTitle || !newDiscTeacherId) return;
    const id = await run(() => db.createDiscipline({ title: newDiscTitle.trim(), conteudistaId: newDiscTeacherId }));
    if (id) {
      setNewDiscTitle('');
      setNewDiscTeacherId('');
      setNewDiscTeamId('');
      setSidebarTab('dashboard'); // volta à visão geral para ver o novo projeto
    }
  };

  // Atualiza a tela na hora (otimista) e confirma no banco em seguida.
  const patchDiscipline = (disciplineId, fn) =>
    setDisciplines(prev => prev.map(d => (d.id === disciplineId ? fn(d) : d)));

  // --- KANBAN ---
  // completeStageId: ao avançar, marca a etapa que está sendo concluída
  const moveStage = (disciplineId, newStage, completeStageId) => {
    const d = disciplines.find(x => x.id === disciplineId);
    const stageDone = completeStageId ? { ...(d?.stageDone || {}), [completeStageId]: true } : (d?.stageDone || {});
    patchDiscipline(disciplineId, x => ({ ...x, stage: newStage, stageDone }));
    return run(() => db.updateDiscipline(disciplineId, { stage: newStage, stage_done: stageDone }));
  };

  // Botão de check de cada etapa do Kanban (Suporte técnico / Administrador)
  const setStageDone = (disciplineId, stageId, done) => {
    const d = disciplines.find(x => x.id === disciplineId);
    const stageDone = { ...(d?.stageDone || {}), [stageId]: done };
    patchDiscipline(disciplineId, x => ({ ...x, stageDone }));
    return run(() => db.updateDiscipline(disciplineId, { stage_done: stageDone }));
  };

  const addTask = (disciplineId, { title, description, dueDate, stage }) =>
    run(() => db.addTask({ disciplineId, title, description, dueDate, stage, createdBy: currentUser.id }));

  const updateTask = (disciplineId, taskId, patch) => {
    patchDiscipline(disciplineId, x => ({ ...x, tasks: x.tasks.map(t => (t.id === taskId ? { ...t, ...patch } : t)) }));
    return run(() => db.updateTask(taskId, patch));
  };

  const removeTask = (disciplineId, taskId) => run(() => db.removeTask(taskId));

  // --- MATERIAIS ---
  const changeMaterialStatus = (disciplineId, materialId, newStatus) => {
    patchDiscipline(disciplineId, x => ({ ...x, materials: x.materials.map(m => (m.id === materialId ? { ...m, status: newStatus } : m)) }));
    return run(() => db.updateMaterialStatus(materialId, newStatus));
  };

  const addMaterial = (disciplineId, name, file) =>
    run(() => db.addMaterial({ disciplineId, name, file, senderId: currentUser.id }));

  // --- PENDÊNCIAS E FÓRUM ---
  const addPendency = (disciplineId, text, type) =>
    run(() => db.addPendency({ disciplineId, text, type, authorId: currentUser.id }));

  const resolvePendency = (disciplineId, pendencyId) => run(() => db.resolvePendency(pendencyId));

  const addCommentToPendency = (disciplineId, pendencyId, commentText) => {
    if (!commentText.trim()) return undefined;
    return run(() => db.addComment({ pendencyId, text: commentText.trim(), authorId: currentUser.id }));
  };

  // --- RECURSOS DIDÁTICOS (Editor Estrutural) ---
  const addResource = (disciplineId, title, aula = '') =>
    run(() => db.addResource({
      disciplineId,
      lesson: { aula, titulo: title, objetivo: '', sections: [] },
      authorId: currentUser.id,
    }));

  const updateResource = (disciplineId, resourceId, patch) => {
    const now = new Date().toISOString();
    patchDiscipline(disciplineId, x => ({
      ...x,
      resources: x.resources.map(r => (r.id === resourceId ? { ...r, ...patch, updatedAt: now } : r)),
    }));
    // só o texto da aula (autosave do editor) não precisa recarregar tudo
    const lessonOnly = Object.keys(patch).every(k => k === 'lesson' || k === 'lastEditedBy');
    if (lessonOnly) {
      // autosave do editor: devolve true/false para o editor mostrar "Salvo" ou tentar de novo
      return db.updateResource(resourceId, patch).then(() => true).catch((err) => { console.error(err); return false; });
    }
    return run(() => db.updateResource(resourceId, patch));
  };

  const removeResource = (disciplineId, resourceId) => run(() => db.removeResource(resourceId));

  // --- CARREGANDO SESSÃO ---
  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F1] text-zinc-600 font-semibold">
        Carregando…
      </div>
    );
  }

  // --- TELA DE LOGIN ---
  if (!currentUser) {
    return (
      <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-white text-zinc-900">
        {/* Painel de marca */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-iuvi-escuro via-iuvi-2 to-iuvi-medio p-14 text-white">
          <IuviLogo height={72} negative id="g-login" />
          <div className="max-w-md pb-28">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bege mb-4">Transição Didática</p>
            <h2 className="text-5xl font-extrabold leading-[1.05] mb-5">Janelas para o futuro.</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Acompanhe a transição das disciplinas para o EAD, do recebimento do material à implantação no AVA.
            </p>
          </div>
          <PatternStrip className="absolute inset-x-0 bottom-0 h-28" />
        </div>

        {/* Formulário */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden"><IuviLogo height={60} id="g-login-m" /></div>
            <h1 className="text-3xl font-extrabold text-iuvi mb-1">Acesse o painel</h1>
            <p className="text-zinc-500 mb-8">Entre com seu usuário (ou e-mail) e senha.</p>

            {loginError && (
              <div role="alert" className="bg-[#FDECEC] text-[#9B1C1C] p-3 mb-4 rounded-lg text-sm font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 mb-8">
              <div>
                <label htmlFor="login-user" className="block text-sm font-semibold mb-1.5">Usuário ou e-mail</label>
                <input
                  id="login-user"
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#D9CFC6] rounded-lg focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 transition"
                />
              </div>
              <div>
                <label htmlFor="login-pass" className="block text-sm font-semibold mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-11 border border-[#D9CFC6] rounded-lg focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 transition"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-iuvi"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 bg-iuvi hover:bg-iuvi-2 text-white font-bold rounded-lg transition-colors disabled:opacity-60"
              >
                {loggingIn ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[#E6DFD7] flex items-center justify-center">
              <UfcLogo height={64} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SIDEBAR ---
  const Sidebar = () => (
    <aside className="relative w-64 bg-gradient-to-b from-iuvi-escuro to-iuvi-roxo text-white flex flex-col h-screen shrink-0 overflow-hidden">
      <div className="p-6 pb-5">
        <IuviLogo height={44} negative id="g-side" />
        <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-bege">Transição Didática</div>
      </div>

      <a
        href="https://drive.google.com/file/d/1auHfQU8K5GwKGPGEkiImpWx4kmg3b2Qq/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-4 mb-3 flex items-center justify-center gap-2 rounded-xl bg-bege px-4 py-2.5 text-sm font-bold text-iuvi-escuro hover:brightness-95 transition"
      >
        <BookOpen size={16} />
        Manual de uso do sistema
      </a>

      <div className="mx-4 mb-4 p-4 rounded-xl bg-white/10">
        <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1 font-semibold">Perfil ativo</div>
        <div className="font-bold flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-[#4ADE80] rounded-full shrink-0"></span>
          {currentUser.name}
        </div>
        <div className="text-xs text-bege mt-1">
          {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'tecnico' ? 'Suporte Técnico' : 'Docente / Conteudista'}
        </div>
        {currentUser.role !== 'admin' && (
          <div className="text-[11px] text-white/70 mt-0.5">Equipe: {teamName(currentUser.teamId)}</div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] text-white/50 uppercase tracking-widest px-3 mb-2 font-semibold">Navegação</div>

        <button
          onClick={() => { setActiveDisciplineId(null); setSidebarTab('dashboard'); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${(sidebarTab === 'dashboard' && !activeDisciplineId) ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          <LayoutDashboard size={18} />
          <span>Painel de Projetos</span>
        </button>

        {/* Menu do Administrador */}
        {currentUser.role === 'admin' && (
          <>
            <div className="text-[10px] text-white/50 uppercase tracking-widest px-3 pt-2 mb-2 font-semibold">Administração</div>
            <button
              onClick={() => { setActiveDisciplineId(null); setSidebarTab('equipe'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${sidebarTab === 'equipe' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Users size={18} />
              <span>Equipes</span>
            </button>
            <button
              onClick={() => { setActiveDisciplineId(null); setSidebarTab('disciplinas'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${sidebarTab === 'disciplinas' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <FolderPlus size={18} />
              <span>Nova Disciplina</span>
            </button>
          </>
        )}

        {/* Menus administrativos exclusivos da Equipe Técnica */}
        {currentUser.role === 'tecnico' && (
          <>
            <div className="text-[10px] text-white/50 uppercase tracking-widest px-3 pt-6 mb-2 font-semibold">Administração</div>

        <button
          onClick={() => { setActiveDisciplineId(null); setSidebarTab('professores'); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${sidebarTab === 'professores' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          <Users size={18} />
          <span>Gerenciar Professores</span>
        </button>

        <button
          onClick={() => { setActiveDisciplineId(null); setSidebarTab('disciplinas'); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${sidebarTab === 'disciplinas' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          <FolderPlus size={18} />
          <span>Nova Disciplina</span>
        </button>
          </>
        )}
      </nav>

      <div className="p-4 relative z-10">
        <div className="px-3 py-3 mb-3 flex items-center justify-center border-t border-white/15">
          <UfcLogo height={64} white />
        </div>
        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Sair do sistema
        </button>
      </div>
    </aside>
  );

  // --- SUB-TELA: GERENCIAMENTO DE PROFESSORES ---
  const TeachersManagement = () => (
    <div className="p-8 max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1 text-[#991F50]">Gerenciar Professores Conteudistas</h2>
        <p className="text-zinc-600 text-sm">{`Docentes da ${teamName(currentUser.teamId)}. Todos os suportes técnicos desta equipe veem estes docentes e as disciplinas deles; outras equipes não.`}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Novo Professor */}
        <div className="bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <UserPlus className="text-[#991F50]" size={20} />
            Cadastrar Docente
          </h3>
          <form onSubmit={handleCreateProfessor} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Nome Completo</label>
              <input 
                type="text" 
                required
                value={newProfName}
                onChange={(e) => setNewProfName(e.target.value)}
                placeholder="Ex: Profa. Juliana Fernandes"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Usuário de Login</label>
              <input 
                type="text" 
                required
                value={newProfUser}
                onChange={(e) => setNewProfUser(e.target.value)}
                placeholder="Ex: juliana"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Senha de Acesso</label>
              <input
                type="text"
                required
                value={newProfPass}
                onChange={(e) => setNewProfPass(e.target.value)}
                placeholder="Ex: julia2026"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2 bg-iuvi-roxo text-white hover:bg-iuvi-roxo-medio transition-colors font-bold text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} /> Salvar Cadastro
            </button>
          </form>
        </div>

        {/* Lista de Professores cadastrados */}
        <div className="lg:col-span-2 bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="text-[#991F50]" size={20} />
            Professores Cadastrados
          </h3>
          <div className="space-y-3">
            {getVisibleProfessors().length === 0 && (
              <p className="text-sm text-zinc-500">Nenhum professor cadastrado ainda.</p>
            )}
            {getVisibleProfessors().map(prof => (
              <div key={prof.id} className="p-4 border border-zinc-300 hover:border-iuvi transition-all bg-zinc-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900">{prof.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                    <span>Login: <strong className="font-mono">{prof.username}</strong></span>
                  </div>
                </div>
                <div className="bg-[#FBEEF3] p-2 border border-[#F0CFDB]">
                  <span className="text-xs font-bold text-[#991F50] uppercase">Docente</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // --- SUB-TELA (ADMINISTRADOR): EQUIPES ---
  const TeamsManagement = () => (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1 text-[#991F50]">Equipes</h2>
        <p className="text-zinc-600 text-sm">
          Cada equipe reúne suportes técnicos e conteudistas. Todos os suportes técnicos de uma equipe enxergam as disciplinas e os conteudistas dessa equipe, e de nenhuma outra.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <PlusCircle className="text-[#991F50]" size={20} />
            Nova equipe
          </h3>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1" htmlFor="team-name">Nome da equipe</label>
              <input
                id="team-name"
                type="text"
                required
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Ex: Equipe de Exatas"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-iuvi-roxo text-white hover:bg-iuvi-roxo-medio transition-colors font-bold text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} /> Criar equipe
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {teams.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhuma equipe ainda. Crie a primeira ao lado.</p>
          )}
          {teams.map(team => {
            const techs = users.filter(u => u.role === 'tecnico' && u.teamId === team.id);
            const profs = users.filter(u => u.role === 'conteudista' && u.teamId === team.id);
            const profIds = new Set(profs.map(p => p.id));
            const discCount = disciplines.filter(d => profIds.has(d.conteudistaId)).length;
            const open = memberTeamId === team.id;
            const member = (u) => (
              <div key={u.id} className="p-3 border border-zinc-200 bg-zinc-50 rounded-lg">
                <div className="font-bold text-sm text-zinc-900">{u.name}</div>
                <div className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-zinc-500">
                  <span>Login: <strong className="font-mono">{u.username}</strong></span>
                </div>
                {pwEditId === u.id ? (
                  <form onSubmit={(e) => handleChangePassword(e, u)} className="mt-2 flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      required
                      minLength={6}
                      aria-label={'Nova senha de ' + u.name}
                      value={pwValue}
                      onChange={(e) => setPwValue(e.target.value)}
                      placeholder="Nova senha (mín. 6 caracteres)"
                      className="min-w-0 flex-1 p-1.5 border border-[#D9CFC6] rounded-lg text-xs focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-iuvi-roxo text-white hover:bg-iuvi-roxo-medio text-xs font-bold rounded-lg">Salvar</button>
                    <button type="button" onClick={() => { setPwEditId(null); setPwValue(''); }} className="px-3 py-1.5 border border-[#D9CFC6] text-xs font-bold rounded-lg hover:bg-zinc-100">Cancelar</button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setPwEditId(u.id); setPwValue(''); }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#991F50] hover:underline"
                  >
                    <Lock size={12} /> Alterar senha
                  </button>
                )}
              </div>
            );
            return (
              <div key={team.id} className="bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-extrabold text-xl text-zinc-900 flex items-center gap-2">
                    <Users className="text-[#991F50]" size={22} /> {team.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="bg-[#FBEEF3] text-[#991F50] border border-[#F0CFDB] px-2.5 py-1">{techs.length} suporte{techs.length === 1 ? '' : 's'} técnico{techs.length === 1 ? '' : 's'}</span>
                    <span className="bg-[#FBEEF3] text-[#991F50] border border-[#F0CFDB] px-2.5 py-1">{profs.length} conteudista{profs.length === 1 ? '' : 's'}</span>
                    <span className="bg-zinc-100 text-zinc-700 border border-zinc-200 px-2.5 py-1">{discCount} disciplina{discCount === 1 ? '' : 's'}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Suporte técnico</div>
                    <div className="space-y-2">
                      {techs.length === 0 && <p className="text-xs text-zinc-400 italic">Nenhum ainda.</p>}
                      {techs.map(member)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Conteudistas</div>
                    <div className="space-y-2">
                      {profs.length === 0 && <p className="text-xs text-zinc-400 italic">Nenhum ainda.</p>}
                      {profs.map(member)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-zinc-200 pt-4">
                  {!open ? (
                    <button
                      type="button"
                      onClick={() => { setMemberTeamId(team.id); setMemberDraft({ name: '', username: '', password: '', role: 'tecnico' }); }}
                      className="inline-flex items-center gap-2 border-2 border-dashed border-[#D9CFC6] rounded-xl px-4 py-2 text-sm font-bold text-[#991F50] hover:bg-[#FBEEF3] transition-colors"
                    >
                      <UserPlus size={16} /> Adicionar membro
                    </button>
                  ) : (
                    <form onSubmit={handleCreateMember} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2 text-sm font-bold">Novo membro de {team.name}</div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1" htmlFor={'m-role-' + team.id}>Perfil</label>
                        <select
                          id={'m-role-' + team.id}
                          value={memberDraft.role}
                          onChange={(e) => setMemberDraft({ ...memberDraft, role: e.target.value })}
                          className="w-full p-2 border border-[#D9CFC6] rounded-xl bg-white text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                        >
                          <option value="tecnico">Suporte técnico</option>
                          <option value="conteudista">Conteudista (professor)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1" htmlFor={'m-name-' + team.id}>Nome completo</label>
                        <input
                          id={'m-name-' + team.id}
                          type="text"
                          required
                          value={memberDraft.name}
                          onChange={(e) => setMemberDraft({ ...memberDraft, name: e.target.value })}
                          placeholder="Ex: Ana Souza"
                          className="w-full p-2 border border-[#D9CFC6] rounded-xl text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1" htmlFor={'m-user-' + team.id}>Usuário de login</label>
                        <input
                          id={'m-user-' + team.id}
                          type="text"
                          required
                          value={memberDraft.username}
                          onChange={(e) => setMemberDraft({ ...memberDraft, username: e.target.value })}
                          placeholder="Ex: ana"
                          className="w-full p-2 border border-[#D9CFC6] rounded-xl text-sm font-mono focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1" htmlFor={'m-pass-' + team.id}>Senha de acesso</label>
                        <input
                          id={'m-pass-' + team.id}
                          type="text"
                          required
                          value={memberDraft.password}
                          onChange={(e) => setMemberDraft({ ...memberDraft, password: e.target.value })}
                          placeholder="Ex: ana2026"
                          className="w-full p-2 border border-[#D9CFC6] rounded-xl text-sm focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="flex-1 py-2 bg-iuvi-roxo text-white hover:bg-iuvi-roxo-medio transition-colors font-bold text-sm flex items-center justify-center gap-2">
                          <PlusCircle size={16} /> Salvar membro
                        </button>
                        <button type="button" onClick={() => setMemberTeamId(null)} className="px-4 py-2 border border-[#D9CFC6] rounded-xl text-sm font-bold hover:bg-zinc-100">
                          Fechar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // --- SUB-TELA: CADASTRO DE DISCIPLINAS ---
  const DisciplineManagement = () => (
    <div className="p-8 max-w-3xl">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1 text-[#991F50]">Criar Novo Projeto de Transição</h2>
        <p className="text-zinc-600 text-sm">Inicie a implantação de uma nova disciplina atribuída a um professor cadastrado.</p>
      </header>

      <div className="bg-white border border-[#D9CFC6] rounded-xl p-8 shadow-md">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-zinc-900">
          <FolderPlus className="text-[#991F50]" size={22} />
          Detalhes da Disciplina
        </h3>
        <form onSubmit={handleCreateDiscipline} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-1">Título da Disciplina</label>
            <input 
              type="text" 
              required
              value={newDiscTitle}
              onChange={(e) => setNewDiscTitle(e.target.value)}
              placeholder="Ex: Metodologias Ativas no Ensino Superior"
              className="w-full p-3 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20"
            />
          </div>

          {(() => {
            // equipe efetiva: o administrador escolhe; o suporte técnico fica na própria equipe
            const isAdmin = currentUser.role === 'admin';
            const teamId = isAdmin ? (newDiscTeamId === '' ? null : Number(newDiscTeamId)) : currentUser.teamId;
            const docentes = users.filter(u => u.role === 'conteudista' && u.teamId === teamId);
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-1" htmlFor="disc-team">1. Equipe</label>
                  <select
                    id="disc-team"
                    required
                    disabled={!isAdmin}
                    value={isAdmin ? newDiscTeamId : String(currentUser.teamId)}
                    onChange={(e) => { setNewDiscTeamId(e.target.value); setNewDiscTeacherId(''); }}
                    className="w-full p-3 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 bg-white disabled:bg-zinc-100 disabled:text-zinc-600"
                  >
                    <option value="">Selecione a equipe...</option>
                    {(isAdmin ? teams : teams.filter(t => t.id === currentUser.teamId)).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  {!isAdmin && <p className="mt-1 text-xs text-zinc-500">Você cria disciplinas para a sua equipe.</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-1" htmlFor="disc-teacher">2. Conteudista</label>
                  <select
                    id="disc-teacher"
                    required
                    disabled={teamId === null}
                    value={newDiscTeacherId}
                    onChange={(e) => setNewDiscTeacherId(e.target.value)}
                    className="w-full p-3 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 bg-white disabled:bg-zinc-100 disabled:text-zinc-500"
                  >
                    <option value="">{teamId === null ? 'Escolha a equipe primeiro' : docentes.length ? 'Selecione o conteudista...' : 'Esta equipe ainda não tem conteudistas'}</option>
                    {docentes.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })()}

          <div className="bg-[#FBEEF3] border border-[#F0CFDB] p-4 text-xs text-zinc-600">
            <strong>Fase Inicial Automática:</strong> Ao criar a nova disciplina, ela será adicionada automaticamente à primeira etapa do Kanban de Implantação: <strong>Recebimento</strong>.
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#991F50] hover:bg-[#801436] text-white font-bold uppercase tracking-wider border border-[#D9CFC6] rounded-xl shadow-sm transition-all text-sm"
          >
            Adicionar e Iniciar Transição
          </button>
        </form>
      </div>
    </div>
  );

  // --- DASHBOARD PRINCIPAL ---
  const Dashboard = () => {
    const visibleDisciplines = getVisibleDisciplines();

    return (
      <div className="p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold mb-1 text-[#991F50] tracking-tight">Painel de Projetos</h2>
          <p className="text-zinc-600 text-sm">Gestão e acompanhamento operacional da transição didática da IUVI.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleDisciplines.map(d => {
            const currentStageObj = KANBAN_STAGES.find(s => s.id === d.stage);
            const openPendencies = d.pendencies.filter(p => p.status === 'aberta').length;

            return (
              <div 
                key={d.id} 
                onClick={() => setActiveDisciplineId(d.id)}
                className="bg-white border border-[#D9CFC6] rounded-xl p-6 cursor-pointer hover:-translate-y-1 transition-transform shadow-md hover:shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#FBEEF3] p-2 border border-iuvi">
                    <BookOpen size={24} className="text-[#991F50]" />
                  </div>
                  {openPendencies > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 flex items-center gap-1 border border-red-200">
                      <AlertCircle size={12} />
                      {openPendencies} pendência{openPendencies > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-xl mb-1 text-black line-clamp-2">{d.title}</h3>
                <p className="text-xs text-zinc-600 mb-4 flex items-center gap-1">
                   <Users size={12}/> Prof(a). {users.find(u => u.id === d.conteudistaId)?.name || 'Docente'}
                </p>
                {currentUser.role === 'admin' && (
                  <p className="text-[11px] text-zinc-500 -mt-3 mb-4">
                    Equipe: {teamName(users.find(p => p.id === d.conteudistaId)?.teamId)}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-zinc-200">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">Fase Atual</div>
                  <div className="font-bold text-[#991F50] flex items-center justify-between text-sm">
                    {currentStageObj?.title}
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  // --- DETALHES DO PROJETO COM AS ABAS ---
  const ProjectDetails = () => {
    if (!activeDiscipline) return null;
    const isTecnico = currentUser.role === 'tecnico' || currentUser.role === 'admin';

    return (
      <div className="flex flex-col h-full">
        {/* Header do Projeto */}
        <div className="bg-white border-b border-[#E6DFD7] p-8 shrink-0">
          <button 
            onClick={() => setActiveDisciplineId(null)}
            className="text-sm text-zinc-500 hover:text-[#991F50] mb-4 flex items-center gap-1 transition-colors font-bold"
          >
            ← Voltar para Visão Geral
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-black">{activeDiscipline.title}</h2>
              <p className="text-zinc-600 mt-1">
                Conteudista responsável: <strong className="text-[#991F50]">{users.find(u => u.id === activeDiscipline.conteudistaId)?.name}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Status Global</div>
              <div className="inline-flex items-center gap-2 bg-[#991F50] text-white px-4 py-2 border border-[#D9CFC6] rounded-xl shadow-sm font-bold text-sm">
                {KANBAN_STAGES.find(s => s.id === activeDiscipline.stage)?.title}
              </div>
            </div>
          </div>

          {/* Abas de Navegação interna da disciplina */}
          <div className="flex gap-6 mt-8 border-b border-zinc-200">
            {[
              { id: 'kanban', label: 'Kanban / Processo', icon: KanbanSquare },
              { id: 'materiais', label: 'Materiais de Apoio', icon: FileText },
              { id: 'pendencias', label: 'Pendências e Fórum', icon: AlertCircle },
              { id: 'recursos', label: 'Editor Estrutural', icon: Wand2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 font-bold transition-colors ${activeTab === tab.id ? 'border-b-4 border-iuvi text-[#991F50]' : 'text-zinc-400 hover:text-zinc-700'}`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.id === 'pendencias' && activeDiscipline.pendencies.filter(p => p.status === 'aberta').length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1 font-extrabold">
                    {activeDiscipline.pendencies.filter(p => p.status === 'aberta').length}
                  </span>
                )}
              </button>
            ))}
            {/* Botão vermelho: guia em vídeo, ao lado da aba Editor Estrutural */}
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              title="Assistir ao guia em vídeo do Editor Estrutural"
              className="-ml-3 mb-3 flex h-8 items-center gap-1.5 self-center rounded-full bg-red-600 px-3.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-red-700"
            >
              <PlayCircle size={15} /> Vídeo
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-auto p-8 bg-[#F8F5F1]">
          {activeTab === 'kanban' && <KanbanTab discipline={activeDiscipline} isTecnico={isTecnico} />}
          {activeTab === 'materiais' && <MaterialsTab discipline={activeDiscipline} isTecnico={isTecnico} />}
          {activeTab === 'pendencias' && <PendenciesTab discipline={activeDiscipline} isTecnico={isTecnico} />}
          {activeTab === 'recursos' && <RecursosTab discipline={activeDiscipline} isTecnico={isTecnico} currentUser={currentUser} />}
        </div>
      </div>
    );
  };


  // --- SELECIONA TELA GERAL ---
  const renderMainContent = () => {
    if (activeDisciplineId) {
      return ProjectDetails();
    }
    const isAdmin = currentUser.role === 'admin';
    switch (sidebarTab) {
      case 'equipe':
        return isAdmin ? TeamsManagement() : Dashboard();
      case 'professores':
        return currentUser.role === 'tecnico' ? TeachersManagement() : Dashboard();
      case 'disciplinas':
        return currentUser.role === 'conteudista' ? Dashboard() : DisciplineManagement();
      case 'dashboard':
      default:
        return Dashboard();
    }
  };

  return (
    <ActionsContext.Provider value={{ moveStage, setStageDone, addTask, updateTask, removeTask, changeMaterialStatus, addMaterial, addPendency, resolvePendency, addCommentToPendency, addResource, updateResource, removeResource }}>
    <div className="flex h-screen bg-[#F8F5F1] font-sans text-zinc-900 overflow-hidden">
      {Sidebar()}
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>

      {/* Aviso antes de sair */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmLogout(false); }}
        >
          <div role="alertdialog" aria-modal="true" aria-labelledby="logout-title" aria-describedby="logout-desc" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FBEEF3] text-[#991F50]">
              <LogOut size={22} />
            </div>
            <h2 id="logout-title" className="text-lg font-extrabold text-zinc-900">Deseja sair do sistema?</h2>
            <p id="logout-desc" className="mt-1 text-sm text-zinc-600">
              Você precisará entrar novamente com seu usuário e senha. O que você já fez está salvo.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmLogout(false)}
                className="rounded-xl border border-[#D9CFC6] px-5 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => { setConfirmLogout(false); handleLogout(); }}
                className="rounded-xl bg-[#991F50] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#801436]"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guia em vídeo do Editor Estrutural (arquivo guia-editor-estrutural.html na raiz do site) */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setGuideOpen(false); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Guia em vídeo do Editor Estrutural" className="flex h-full max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
              <span className="flex items-center gap-2 font-bold text-zinc-900">
                <PlayCircle size={18} className="text-red-600" /> Guia em vídeo — Editor Estrutural
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="./guia-editor-estrutural.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold hover:bg-zinc-100"
                >
                  Abrir em nova aba
                </a>
                <button
                  type="button"
                  onClick={() => setGuideOpen(false)}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-700"
                >
                  Fechar
                </button>
              </div>
            </div>
            <iframe title="Guia em vídeo do Editor Estrutural" src="./guia-editor-estrutural.html" className="min-h-0 w-full flex-1 border-0" />
          </div>
        </div>
      )}
    </div>
    </ActionsContext.Provider>
  );
}