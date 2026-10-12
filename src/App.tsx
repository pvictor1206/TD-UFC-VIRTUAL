import React, { useState, useEffect, useContext } from 'react';
import RecursosTab from './RecursosTab';
import { IuviLogo, UfcLogo, PatternStrip } from './Brand';
import { ActionsContext } from './context';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  FileText, 
  AlertCircle, 
  LogOut, 
  UploadCloud,
  CheckCircle2,
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
  Eye,
  EyeOff
} from 'lucide-react';

// --- DADOS INICIAIS ---

// Perfis: 'admin' (Administrador), 'tecnico' (Equipe Técnica) e 'conteudista' (Professor).
// - O administrador cria perfis da Equipe Técnica e cria professores alocando-os a alguém da equipe.
// - Cada professor tem `createdBy` = id de quem responde por ele (membro da Equipe Técnica);
//   a Equipe Técnica só enxerga os professores que lhe pertencem e o conteúdo deles.
const ADMIN_USER = { id: 4, name: 'Administrador', role: 'admin', username: 'administrador', password: '123' };

const INITIAL_USERS = [
  ADMIN_USER,
  { id: 1, name: 'Equipe Técnica EAD', role: 'tecnico', username: 'admin', password: '123', createdBy: 4 },
  { id: 2, name: 'Prof. Carlos Silva', role: 'conteudista', username: 'carlos', password: '123', createdBy: 1 },
  { id: 3, name: 'Profa. Mariana Costa', role: 'conteudista', username: 'mariana', password: '123', createdBy: 1 }
];

// Dados salvos antes dos perfis: garante um administrador e dá um responsável a cada professor.
const normalizeUsers = (list) => {
  let users = Array.isArray(list) && list.length ? list : INITIAL_USERS;
  if (!users.some(u => u.role === 'admin')) {
    const idTaken = users.some(u => u.id === ADMIN_USER.id);
    const nameTaken = users.some(u => u.username === ADMIN_USER.username);
    users = [{ ...ADMIN_USER, id: idTaken ? Date.now() : ADMIN_USER.id, username: nameTaken ? 'administrador1' : ADMIN_USER.username }, ...users];
  }
  const firstTecnico = users.find(u => u.role === 'tecnico');
  return users.map(u =>
    u.role === 'conteudista' && u.createdBy == null && firstTecnico ? { ...u, createdBy: firstTecnico.id } : u
  );
};

const KANBAN_STAGES = [
  { id: 'recebimento', title: 'Recebimento' },
  { id: 'design_educacional', title: 'Design Educacional' },
  { id: 'producao', title: 'Produção Audiovisual/Gráfica' },
  { id: 'revisao', title: 'Revisão Final' },
  { id: 'implantado', title: 'Implantado no AVA' }
];

const INITIAL_DATA = [
  {
    id: 101,
    title: 'Introdução à Programação',
    conteudistaId: 2,
    stage: 'producao',
    materials: [
      { id: 1, name: 'Apostila_Unidade1.pdf', date: '2026-05-10', sender: 'Prof. Carlos Silva', status: 'recebido' },
      { id: 2, name: 'Roteiros_Videos.docx', date: '2026-05-12', sender: 'Prof. Carlos Silva', status: 'aguandando_analise' }
    ],
    pendencies: [
      { 
        id: 1, 
        text: 'O vídeo da aula 3 está sem áudio nos primeiros 10 segundos.', 
        status: 'aberta', 
        author: 'Equipe Técnica EAD', 
        type: 'tecnico_para_professor',
        comments: [
          { id: 11, author: 'Prof. Carlos Silva', text: 'Vou regravar essa introdução e enviar até amanhã.', date: '16/05/2026' }
        ]
      },
      {
        id: 2,
        text: 'Gostaria de trocar o slide do módulo 1 por uma versão mais recente.',
        status: 'aberta',
        author: 'Prof. Carlos Silva',
        type: 'professor_para_tecnico',
        comments: []
      }
    ]
  },
  {
    id: 102,
    title: 'História da Arte Moderna',
    conteudistaId: 3,
    stage: 'design_educacional',
    materials: [
      { id: 3, name: 'Banco_Imagens_AltaRes.zip', date: '2026-05-15', sender: 'Profa. Mariana Costa', status: 'aguandando_analise' }
    ],
    pendencies: []
  },
  {
    id: 103,
    title: 'Cálculo Diferencial',
    conteudistaId: 2,
    stage: 'recebimento',
    materials: [],
    pendencies: [
      { 
        id: 3, 
        text: 'Aguardando envio das ementas atualizadas para iniciar.', 
        status: 'aberta', 
        author: 'Equipe Técnica EAD', 
        type: 'tecnico_para_professor',
        comments: [] 
      }
    ]
  }
];

// Persistência simples no navegador (os dados do painel são só locais)
const STORAGE_KEY = 'iuvi-painel:v1';
const loadSaved = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

  // --- KANBAN COM CONTROLE DE IDA E VOLTA ---
  const KanbanTab = ({ discipline, isTecnico }) => {
    const { moveStage, addTask, updateTask, removeTask } = useContext(ActionsContext);
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
                  {isPast && <CheckCircle2 size={18} className="text-green-600" />}
                </div>

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
                            onClick={() => moveStage(discipline.id, KANBAN_STAGES[index + 1].id)}
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

    const handleUpload = (e) => {
      e.preventDefault();
      if(newFileName.trim() === '') return;
      addMaterial(discipline.id, newFileName);
      setNewFileName('');
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
          <p className="text-sm text-zinc-600 mb-4">Adicione o link do Google Drive ou nome do material didático para a equipe técnica analisar.</p>
          <form onSubmit={handleUpload} className="flex gap-3">
            <input 
              type="text" 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Ex: Roteiro_Vídeos_Unidade_2.pdf ou Link para Pasta do Drive" 
              className="flex-1 border border-[#D9CFC6] rounded-xl p-2.5 focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm bg-[#F8F5F1]/30 font-medium"
            />
            <button 
              type="submit"
              className="bg-iuvi-roxo text-white px-6 py-2.5 font-bold flex items-center gap-2 hover:bg-iuvi-roxo-medio transition-colors text-sm shrink-0"
            >
              <UploadCloud size={18} />
              Enviar Material
            </button>
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
                      <h5 className="font-bold text-base text-zinc-900">{file.name}</h5>
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
  const [users, setUsers] = useState(() => normalizeUsers(loadSaved('users', INITIAL_USERS)));
  const [currentUser, setCurrentUser] = useState(null);
  const [disciplines, setDisciplines] = useState(() => loadSaved('disciplines', INITIAL_DATA));

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}:users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}:disciplines`, JSON.stringify(disciplines));
    } catch {
      // armazenamento indisponível ou cheio — segue só em memória
    }
  }, [users, disciplines]);
  
  // Controle de Navegação e Modais
  const [activeDisciplineId, setActiveDisciplineId] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban'); // kanban, materiais, pendencias
  const [sidebarTab, setSidebarTab] = useState('dashboard'); // dashboard, professores, disciplinas
  
  // Login simulado
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Formulários Administrativos
  const [newProfName, setNewProfName] = useState('');
  const [newProfUser, setNewProfUser] = useState('');
  const [newProfPass, setNewProfPass] = useState('');
  const [newProfOwner, setNewProfOwner] = useState(''); // administrador: membro da Equipe Técnica responsável

  const [newTecName, setNewTecName] = useState('');
  const [newTecUser, setNewTecUser] = useState('');
  const [newTecPass, setNewTecPass] = useState('');
  
  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscTeacherId, setNewDiscTeacherId] = useState('');

  // Professores que o usuário logado pode ver: o administrador vê todos;
  // a Equipe Técnica vê só os que ela mesma (ou o administrador, em nome dela) cadastrou.
  const getVisibleProfessors = () => {
    if (!currentUser) return [];
    const professors = users.filter(u => u.role === 'conteudista');
    if (currentUser.role === 'admin') return professors;
    if (currentUser.role === 'tecnico') return professors.filter(u => u.createdBy === currentUser.id);
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

  // --- AÇÕES DO ESTADO ---

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveDisciplineId(null);
      setSidebarTab('dashboard');
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleCreateProfessor = (e) => {
    e.preventDefault();
    if (!newProfName || !newProfUser || !newProfPass) return;
    const isAdmin = currentUser.role === 'admin';
    if (isAdmin && !newProfOwner) return;

    // Evita duplicados básicos
    if (users.find(u => u.username === newProfUser)) {
      alert('Este nome de usuário já está sendo utilizado!');
      return;
    }

    const newProf = {
      id: Date.now(),
      name: newProfName,
      role: 'conteudista',
      username: newProfUser,
      password: newProfPass,
      // administrador escolhe a quem alocar; a Equipe Técnica fica responsável pelos que cadastra
      createdBy: isAdmin ? parseInt(newProfOwner) : currentUser.id
    };

    setUsers([...users, newProf]);
    setNewProfName('');
    setNewProfUser('');
    setNewProfPass('');
    setNewProfOwner('');
  };

  const handleCreateTecnico = (e) => {
    e.preventDefault();
    if (!newTecName || !newTecUser || !newTecPass) return;
    if (users.find(u => u.username === newTecUser)) {
      alert('Este nome de usuário já está sendo utilizado!');
      return;
    }
    setUsers([...users, {
      id: Date.now(),
      name: newTecName,
      role: 'tecnico',
      username: newTecUser,
      password: newTecPass,
      createdBy: currentUser.id
    }]);
    setNewTecName('');
    setNewTecUser('');
    setNewTecPass('');
  };

  const handleCreateDiscipline = (e) => {
    e.preventDefault();
    if (!newDiscTitle || !newDiscTeacherId) return;

    const newDisc = {
      id: Date.now(),
      title: newDiscTitle,
      conteudistaId: parseInt(newDiscTeacherId),
      stage: 'recebimento',
      materials: [],
      pendencies: []
    };

    setDisciplines([...disciplines, newDisc]);
    setNewDiscTitle('');
    setNewDiscTeacherId('');
    setSidebarTab('dashboard'); // Retorna à visão geral para ver o novo projeto
  };

  // --- RECURSOS DIDÁTICOS (Editor Estrutural) ---

  const patchResources = (disciplineId, fn) =>
    setDisciplines(prev => prev.map(d =>
      d.id === disciplineId ? { ...d, resources: fn(d.resources || []) } : d
    ));

  const addResource = (disciplineId, title, aula = '') => {
    const id = Date.now();
    const now = new Date().toISOString();
    patchResources(disciplineId, list => [...list, {
      id,
      lesson: { aula, titulo: title, objetivo: '', sections: [] },
      status: 'rascunho',
      feedback: '',
      author: currentUser.name,
      lastEditedBy: currentUser.name,
      createdAt: now,
      updatedAt: now
    }]);
    return id;
  };

  const updateResource = (disciplineId, resourceId, patch) => {
    patchResources(disciplineId, list => list.map(r =>
      r.id === resourceId ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
    ));
  };

  const removeResource = (disciplineId, resourceId) => {
    patchResources(disciplineId, list => list.filter(r => r.id !== resourceId));
  };

  const moveStage = (disciplineId, newStage) => {
    setDisciplines(disciplines.map(d => 
      d.id === disciplineId ? { ...d, stage: newStage } : d
    ));
  };

  // --- TAREFAS DO KANBAN (criadas pela Equipe Técnica / Administrador) ---
  const patchTasks = (disciplineId, fn) =>
    setDisciplines(prev => prev.map(d =>
      d.id === disciplineId ? { ...d, tasks: fn(d.tasks || []) } : d
    ));

  const addTask = (disciplineId, { title, description, dueDate, stage }) =>
    patchTasks(disciplineId, list => [...list, {
      id: Date.now(),
      title,
      description: description || '',
      dueDate: dueDate || '',
      stage,
      done: false,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString(),
    }]);

  const updateTask = (disciplineId, taskId, patch) =>
    patchTasks(disciplineId, list => list.map(t => (t.id === taskId ? { ...t, ...patch } : t)));

  const removeTask = (disciplineId, taskId) =>
    patchTasks(disciplineId, list => list.filter(t => t.id !== taskId));

  const changeMaterialStatus = (disciplineId, materialId, newStatus) => {
    setDisciplines(disciplines.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          materials: d.materials.map(m => 
            m.id === materialId ? { ...m, status: newStatus } : m
          )
        };
      }
      return d;
    }));
  };

  const addMaterial = (disciplineId, fileName) => {
    setDisciplines(disciplines.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          materials: [...d.materials, {
            id: Date.now(),
            name: fileName,
            date: new Date().toISOString().split('T')[0],
            sender: currentUser.name,
            status: 'aguandando_analise'
          }]
        };
      }
      return d;
    }));
  };

  const addPendency = (disciplineId, text, type) => {
    setDisciplines(disciplines.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          pendencies: [...d.pendencies, {
            id: Date.now(),
            text,
            status: 'aberta',
            author: currentUser.name,
            type: type,
            comments: []
          }]
        };
      }
      return d;
    }));
  };

  const resolvePendency = (disciplineId, pendencyId) => {
    setDisciplines(disciplines.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          pendencies: d.pendencies.map(p => 
            p.id === pendencyId ? { ...p, status: 'resolvida' } : p
          )
        };
      }
      return d;
    }));
  };

  const addCommentToPendency = (disciplineId, pendencyId, commentText) => {
    if (!commentText.trim()) return;
    setDisciplines(disciplines.map(d => {
      if (d.id === disciplineId) {
        return {
          ...d,
          pendencies: d.pendencies.map(p => {
            if (p.id === pendencyId) {
              return {
                ...p,
                comments: [...p.comments, {
                  id: Date.now(),
                  author: currentUser.name,
                  text: commentText,
                  date: new Date().toLocaleDateString('pt-BR')
                }]
              };
            }
            return p;
          })
        };
      }
      return d;
    }));
  };

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
            <p className="text-zinc-500 mb-8">Entre com seu usuário e senha.</p>

            {loginError && (
              <div role="alert" className="bg-[#FDECEC] text-[#9B1C1C] p-3 mb-4 rounded-lg text-sm font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 mb-8">
              <div>
                <label htmlFor="login-user" className="block text-sm font-semibold mb-1.5">Usuário</label>
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
                className="w-full py-3 bg-iuvi hover:bg-iuvi-2 text-white font-bold rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>

            <div className="bg-[#FBF3E4] border border-bege rounded-lg p-4 text-xs text-zinc-700">
              <h4 className="font-bold text-iuvi-escuro mb-1.5">Acesso rápido para testes</h4>
              <p>Administrador: <strong>administrador</strong> / <strong>123</strong></p>
              <p>Equipe técnica: <strong>admin</strong> / <strong>123</strong></p>
              <p>Conteudista: <strong>carlos</strong> ou <strong>mariana</strong> / <strong>123</strong></p>
            </div>

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

      <div className="mx-4 mb-4 p-4 rounded-xl bg-white/10">
        <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1 font-semibold">Perfil ativo</div>
        <div className="font-bold flex items-center gap-2 text-sm">
          <span className="w-2 h-2 bg-[#4ADE80] rounded-full shrink-0"></span>
          {currentUser.name}
        </div>
        <div className="text-xs text-bege mt-1">
          {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'tecnico' ? 'Equipe Técnica' : 'Docente / Conteudista'}
        </div>
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
              <UserPlus size={18} />
              <span>Equipe Técnica</span>
            </button>
            <button
              onClick={() => { setActiveDisciplineId(null); setSidebarTab('professores'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${sidebarTab === 'professores' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Users size={18} />
              <span>Professores</span>
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
          onClick={() => { setCurrentUser(null); setActiveDisciplineId(null); setSidebarTab('dashboard'); }}
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
        <p className="text-zinc-600 text-sm">{currentUser.role === 'admin' ? 'Você vê todos os docentes. Cadastre novos e aloque cada um a um membro da Equipe Técnica, que passa a acompanhá-lo.' : 'Adicione novos docentes e configure credenciais de acesso. Você enxerga apenas os docentes sob sua responsabilidade.'}</p>
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
            {currentUser.role === 'admin' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Alocar para (Equipe Técnica)</label>
                <select
                  required
                  value={newProfOwner}
                  onChange={(e) => setNewProfOwner(e.target.value)}
                  className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm bg-white"
                >
                  <option value="">Selecione um membro da equipe...</option>
                  {users.filter(u => u.role === 'tecnico').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            )}
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
                    <span>Senha: <strong className="font-mono">{prof.password}</strong></span>
                    {currentUser.role === 'admin' && (
                      <span>Equipe: <strong>{users.find(u => u.id === prof.createdBy)?.name || '—'}</strong></span>
                    )}
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

  // --- SUB-TELA (ADMINISTRADOR): EQUIPE TÉCNICA ---
  const TeamManagement = () => (
    <div className="p-8 max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1 text-[#991F50]">Equipe Técnica</h2>
        <p className="text-zinc-600 text-sm">Crie os perfis da Equipe Técnica. Cada membro acompanha apenas os professores alocados a ele.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <UserPlus className="text-[#991F50]" size={20} />
            Cadastrar Membro
          </h3>
          <form onSubmit={handleCreateTecnico} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={newTecName}
                onChange={(e) => setNewTecName(e.target.value)}
                placeholder="Ex: Ana Souza (Design Educacional)"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Usuário de Login</label>
              <input
                type="text"
                required
                value={newTecUser}
                onChange={(e) => setNewTecUser(e.target.value)}
                placeholder="Ex: ana"
                className="w-full p-2 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Senha de Acesso</label>
              <input
                type="text"
                required
                value={newTecPass}
                onChange={(e) => setNewTecPass(e.target.value)}
                placeholder="Ex: ana2026"
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

        <div className="lg:col-span-2 bg-white border border-[#D9CFC6] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="text-[#991F50]" size={20} />
            Membros da Equipe Técnica
          </h3>
          <div className="space-y-3">
            {users.filter(u => u.role === 'tecnico').map(t => {
              const profs = users.filter(u => u.role === 'conteudista' && u.createdBy === t.id);
              return (
                <div key={t.id} className="p-4 border border-zinc-300 bg-zinc-50 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-zinc-900">{t.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-500">
                      <span>Login: <strong className="font-mono">{t.username}</strong></span>
                      <span>Senha: <strong className="font-mono">{t.password}</strong></span>
                      <span>Professores: <strong>{profs.length}</strong></span>
                    </div>
                  </div>
                  <div className="bg-[#FBEEF3] p-2 border border-[#F0CFDB] shrink-0">
                    <span className="text-xs font-bold text-[#991F50] uppercase">Equipe</span>
                  </div>
                </div>
              );
            })}
          </div>
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

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-1">Selecione o Professor Conteudista</label>
            <select 
              required
              value={newDiscTeacherId}
              onChange={(e) => setNewDiscTeacherId(e.target.value)}
              className="w-full p-3 border border-[#D9CFC6] rounded-xl focus:outline-none focus:border-iuvi focus:ring-2 focus:ring-iuvi/20 bg-white"
            >
              <option value="">Selecione um docente da lista...</option>
              {getVisibleProfessors().map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

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
          <p className="text-zinc-600 text-sm">Gestão e acompanhamento operacional da transição didática da **IUVI**.</p>
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
                    Equipe: {users.find(u => u.id === users.find(p => p.id === d.conteudistaId)?.createdBy)?.name || '—'}
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
        return isAdmin ? TeamManagement() : Dashboard();
      case 'professores':
        return currentUser.role === 'conteudista' ? Dashboard() : TeachersManagement();
      case 'disciplinas':
        return currentUser.role === 'conteudista' ? Dashboard() : DisciplineManagement();
      case 'dashboard':
      default:
        return Dashboard();
    }
  };

  return (
    <ActionsContext.Provider value={{ moveStage, addTask, updateTask, removeTask, changeMaterialStatus, addMaterial, addPendency, resolvePendency, addCommentToPendency, addResource, updateResource, removeResource }}>
    <div className="flex h-screen bg-[#F8F5F1] font-sans text-zinc-900 overflow-hidden">
      {Sidebar()}
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
    </ActionsContext.Provider>
  );
}