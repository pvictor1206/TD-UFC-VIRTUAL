// AMBIENTE DE DEMONSTRAÇÃO (só para gerar as imagens do manual). Imita o cliente do Supabase em memória,
// com dados fictícios e as mesmas regras de visibilidade por equipe. NÃO faz parte do site publicado.
import { SAMPLE_LESSON } from '../criacao de recursos/src/components/LessonRenderer/blankLesson.js';

type Row = Record<string, any>;
const iso = (d: string) => new Date(d).toISOString();

const picture = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='800' height='450' fill='#EEF2FF'/><g fill='#3730A3' opacity='.9'><rect x='120' y='250' width='90' height='120' rx='8'/><rect x='250' y='190' width='90' height='180' rx='8'/><rect x='380' y='130' width='90' height='240' rx='8'/><rect x='510' y='70' width='90' height='300' rx='8'/></g><text x='400' y='415' text-anchor='middle' font-family='sans-serif' font-size='28' fill='#3730A3'>Crescimento por etapa</text></svg>`
)}`;

const lessonDemo = (titulo: string, aula: string) => ({
  aula,
  titulo,
  objetivo: 'Entender o que é um algoritmo e dar os primeiros passos na lógica de programação.',
  cor: '',
  sections: [
    {
      type: 'section', name: 'Abertura', label: '', title: 'Introdução', subtitle: 'O que vamos aprender hoje', titleBefore: '', titleAfter: '',
      children: [
        { type: 'intro', text: 'Um **algoritmo** é uma sequência de passos para resolver um problema. Nesta aula você vai:\n• entender o conceito\n• ler um código simples\n• testar o que aprendeu' },
        { type: 'image', src: picture, alt: 'Gráfico de barras crescente', caption: 'Figura 1 — Evolução ao longo do curso' },
      ],
    },
    {
      type: 'section', name: 'Prática', label: 'EXEMPLO', title: 'Primeiro programa', subtitle: '', titleBefore: '', titleAfter: '',
      children: [
        { type: 'code_block', language: 'python', filename: 'media.py', code: 'notas = [7.5, 8.0, 6.5]\nsoma = 0\nfor n in notas:\n    soma += n\nprint(soma / len(notas))', lineNumbers: 'sim', highlight: '3-4', output: '7.333333333333333', runnable: 'nao', caption: 'Média de uma lista de notas' },
        { type: 'callout', kind: 'dica', title: 'Dica', text: 'Teste o código com valores diferentes e observe a saída.' },
      ],
    },
  ],
});

const seed = () => {
  const teams: Row[] = [{ id: 1, name: 'Equipe EAD', created_at: iso('2026-08-10') }, { id: 2, name: 'Equipe de Exatas', created_at: iso('2026-08-12') }];
  const profiles: Row[] = [
    { id: 'u-adm', name: 'Administrador', username: 'administrador', role: 'admin', team_id: null, email: 'adm@email.com' },
    { id: 'u-ana', name: 'Ana Souza', username: 'ana', role: 'tecnico', team_id: 1, email: 'ana@painel.example.com' },
    { id: 'u-bruno', name: 'Bruno Lima', username: 'bruno', role: 'tecnico', team_id: 1, email: 'bruno@painel.example.com' },
    { id: 'u-carlos', name: 'Prof. Carlos Silva', username: 'carlos', role: 'conteudista', team_id: 1, email: 'carlos@painel.example.com' },
    { id: 'u-mariana', name: 'Profa. Mariana Costa', username: 'mariana', role: 'conteudista', team_id: 1, email: 'mariana@painel.example.com' },
    { id: 'u-marcos', name: 'Marcos Ribeiro', username: 'marcos', role: 'tecnico', team_id: 2, email: 'marcos@painel.example.com' },
    { id: 'u-julia', name: 'Profa. Júlia Fernandes', username: 'julia', role: 'conteudista', team_id: 2, email: 'julia@painel.example.com' },
  ];
  const disciplines: Row[] = [
    { id: 1, title: 'Introdução à Programação', conteudista_id: 'u-carlos', team_id: 1, stage: 'producao', stage_done: { recebimento: true, design_educacional: true }, created_at: iso('2026-08-20') },
    { id: 2, title: 'História da Arte Moderna', conteudista_id: 'u-mariana', team_id: 1, stage: 'design_educacional', stage_done: { recebimento: true }, created_at: iso('2026-08-22') },
    { id: 3, title: 'Cálculo Diferencial', conteudista_id: 'u-julia', team_id: 2, stage: 'recebimento', stage_done: {}, created_at: iso('2026-08-25') },
  ];
  const materials: Row[] = [
    { id: 1, discipline_id: 1, name: 'Apostila_Unidade1.pdf', storage_path: '1/apostila.pdf', size_bytes: 482000, status: 'recebido', sender_id: 'u-carlos', created_at: iso('2026-09-02') },
    { id: 2, discipline_id: 1, name: 'Roteiros_Videos.docx', storage_path: '1/roteiros.docx', size_bytes: 91000, status: 'aguandando_analise', sender_id: 'u-carlos', created_at: iso('2026-09-05') },
    { id: 3, discipline_id: 1, name: 'https://drive.google.com/drive/folders/exemplo-banco-de-imagens', storage_path: null, size_bytes: null, status: 'ajuste', sender_id: 'u-carlos', created_at: iso('2026-09-07') },
    { id: 4, discipline_id: 2, name: 'Banco_Imagens_AltaRes.zip', storage_path: '2/imagens.zip', size_bytes: 9200000, status: 'aguandando_analise', sender_id: 'u-mariana', created_at: iso('2026-09-09') },
  ];
  const pendencies: Row[] = [
    { id: 1, discipline_id: 1, text: 'O vídeo da aula 3 está sem áudio nos primeiros 10 segundos.', type: 'tecnico_para_professor', status: 'aberta', author_id: 'u-ana', created_at: iso('2026-09-10') },
    { id: 2, discipline_id: 1, text: 'Preciso de uma versão sem marca d’água da logo da disciplina.', type: 'tecnico_para_professor', status: 'aberta', author_id: 'u-bruno', created_at: iso('2026-09-11') },
    { id: 3, discipline_id: 1, text: 'Posso trocar a ordem das unidades 2 e 3?', type: 'professor_para_tecnico', status: 'aberta', author_id: 'u-carlos', created_at: iso('2026-09-12') },
    { id: 4, discipline_id: 1, text: 'Revisar a legenda do slide 12.', type: 'tecnico_para_professor', status: 'resolvida', author_id: 'u-ana', created_at: iso('2026-09-01') },
  ];
  const pendency_comments: Row[] = [
    { id: 1, pendency_id: 1, text: 'Vou regravar o trecho e envio hoje à tarde.', author_id: 'u-carlos', created_at: iso('2026-09-10') },
    { id: 2, pendency_id: 1, text: 'Perfeito, obrigada! Aviso quando o novo arquivo chegar.', author_id: 'u-ana', created_at: iso('2026-09-11') },
  ];
  const tasks: Row[] = [
    { id: 1, discipline_id: 1, title: 'Conferir arquivos recebidos', description: 'Apostila e roteiros da Unidade 1.', due_date: '2026-09-03', stage: 'recebimento', done: true, created_by: 'u-ana', created_at: iso('2026-09-01') },
    { id: 2, discipline_id: 1, title: 'Montar a estrutura da aula no Editor', description: '', due_date: '2026-09-10', stage: 'design_educacional', done: true, created_by: 'u-ana', created_at: iso('2026-09-02') },
    { id: 3, discipline_id: 1, title: 'Gravar o vídeo da Aula 3', description: 'Usar o roteiro aprovado. Duração máxima: 8 minutos.', due_date: '2026-09-20', stage: 'producao', done: false, created_by: 'u-ana', created_at: iso('2026-09-08') },
    { id: 4, discipline_id: 1, title: 'Editar e legendar os vídeos', description: '', due_date: '', stage: 'producao', done: true, created_by: 'u-bruno', created_at: iso('2026-09-09') },
  ];
  const resources: Row[] = [
    { id: 1, discipline_id: 1, lesson: lessonDemo('Aula 1 — O que é um algoritmo', '1'), status: 'rascunho', feedback: '', author_id: 'u-carlos', last_edited_by: 'u-carlos', created_at: iso('2026-09-12'), updated_at: iso('2026-09-14') },
    { id: 2, discipline_id: 1, lesson: lessonDemo('Aula 2 — Variáveis e tipos', '2'), status: 'enviado', feedback: '', author_id: 'u-carlos', last_edited_by: 'u-carlos', created_at: iso('2026-09-13'), updated_at: iso('2026-09-15') },
    { id: 3, discipline_id: 1, lesson: lessonDemo('Aula 3 — Condicionais', '3'), status: 'ajuste', feedback: 'Trocar a imagem da Figura 1 por uma com resolução maior e revisar o texto alternativo.', author_id: 'u-carlos', last_edited_by: 'u-ana', created_at: iso('2026-09-13'), updated_at: iso('2026-09-16') },
    { id: 4, discipline_id: 1, lesson: { ...JSON.parse(JSON.stringify(SAMPLE_LESSON)), aula: '0' }, status: 'aprovado', feedback: '', author_id: 'u-carlos', last_edited_by: 'u-ana', created_at: iso('2026-09-10'), updated_at: iso('2026-09-17') },
  ];
  return { teams, profiles, disciplines, materials, pendencies, pendency_comments, tasks, resources };
};

export const db: Record<string, Row[]> = seed();
const counters: Record<string, number> = {};
const nextId = (t: string) => (counters[t] = (counters[t] ?? Math.max(0, ...db[t].map((r) => r.id || 0))) + 1);
export const resetMock = () => { Object.assign(db, seed()); Object.keys(counters).forEach((k) => delete counters[k]); };

let session: { user: Row } | null = null;
const listeners = new Set<(event: string, s: any) => void>();
const emit = (event: string) => listeners.forEach((l) => l(event, session));
const me = () => (session ? db.profiles.find((p) => p.id === session!.user.id) : null);

// --- visibilidade (mesmas regras do banco) ---
const seesDiscipline = (d: Row) => {
  const u = me();
  if (!u) return false;
  return u.role === 'admin' || (u.role === 'tecnico' && d.team_id === u.team_id) || (u.role === 'conteudista' && d.conteudista_id === u.id);
};
const visible = (table: string, rows: Row[]): Row[] => {
  const u = me();
  if (!u) return [];
  if (table === 'teams') return rows.filter((t) => u.role === 'admin' || t.id === u.team_id);
  if (table === 'profiles') return rows.filter((p) => u.role === 'admin' || p.id === u.id || p.team_id === u.team_id);
  if (table === 'disciplines') return rows.filter(seesDiscipline);
  const sees = (did: number) => { const d = db.disciplines.find((x) => x.id === did); return !!d && seesDiscipline(d); };
  if (table === 'pendency_comments') return rows.filter((c) => { const p = db.pendencies.find((x) => x.id === c.pendency_id); return !!p && sees(p.discipline_id); });
  return rows.filter((r) => sees(r.discipline_id));
};

const strip = (r: Row) => { const { email, ...rest } = r; return rest; };
const clone = (v: any) => JSON.parse(JSON.stringify(v));

class Query {
  private filters: Array<(r: Row) => boolean> = [];
  private mode: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private ordering: { col: string } | null = null;
  private wantSingle: '' | 'single' | 'maybe' = '';
  private selectCols = '*';
  private returning = false;
  constructor(private table: string) {}
  select(cols = '*') { if (this.mode === 'select') this.selectCols = cols; else this.returning = true; return this; }
  insert(p: any) { this.mode = 'insert'; this.payload = p; return this; }
  update(p: any) { this.mode = 'update'; this.payload = p; return this; }
  delete() { this.mode = 'delete'; return this; }
  eq(col: string, v: any) { this.filters.push((r) => r[col] === v); return this; }
  ilike() { return this; }
  limit() { return this; }
  order(col: string) { this.ordering = { col }; return this; }
  single() { this.wantSingle = 'single'; return this; }
  maybeSingle() { this.wantSingle = 'maybe'; return this; }

  private embed(rows: Row[]) {
    const cols = this.selectCols;
    return rows.map((r) => {
      const out: Row = { ...strip(r) };
      if (this.table === 'disciplines') {
        for (const child of ['materials', 'pendencies', 'tasks', 'resources']) {
          if (!cols.includes(child + '(')) continue;
          out[child] = visible(child, db[child]).filter((c) => c.discipline_id === r.id).map((c) => {
            const copy: Row = { ...c };
            if (child === 'pendencies' && cols.includes('pendency_comments')) {
              copy.pendency_comments = visible('pendency_comments', db.pendency_comments).filter((k) => k.pendency_id === c.id);
            }
            return copy;
          });
        }
      }
      return clone(out);
    });
  }

  private run(): { data: any; error: any } {
    const rows = db[this.table];
    if (this.mode === 'select') {
      let out = visible(this.table, rows).filter((r) => this.filters.every((f) => f(r)));
      if (this.ordering) out = [...out].sort((a, b) => (a[this.ordering!.col] > b[this.ordering!.col] ? 1 : -1));
      const data = this.embed(out);
      if (this.wantSingle) return { data: data[0] ?? null, error: this.wantSingle === 'single' && !data[0] ? { message: 'Nenhuma linha' } : null };
      return { data, error: null };
    }
    if (this.mode === 'insert') {
      const u = me();
      const row: Row = { ...clone(this.payload), id: this.table === 'profiles' ? this.payload.id : nextId(this.table), created_at: new Date().toISOString() };
      if (this.table === 'teams' && rows.some((t) => t.name.toLowerCase() === String(row.name).toLowerCase())) return { data: null, error: { message: 'duplicate key value violates unique constraint' } };
      if (this.table === 'disciplines') {
        const prof = db.profiles.find((p) => p.id === row.conteudista_id);
        row.team_id = prof?.team_id; row.stage = 'recebimento'; row.stage_done = {}; row.created_by = u?.id;
      }
      if (this.table === 'resources') { row.status = 'rascunho'; row.feedback = ''; row.author_id = row.author_id || u?.id; row.last_edited_by = u?.id; row.updated_at = row.created_at; }
      if (this.table === 'materials') row.status = row.status || 'aguandando_analise';
      if (this.table === 'pendencies') row.status = 'aberta';
      if (this.table === 'tasks') { row.done = false; row.description = row.description || ''; }
      rows.push(row);
      return { data: this.returning ? (this.wantSingle ? { id: row.id, ...strip(row) } : [strip(row)]) : null, error: null };
    }
    const targets = rows.filter((r) => this.filters.every((f) => f(r)));
    if (this.mode === 'update') {
      targets.forEach((t) => {
        Object.assign(t, clone(this.payload));
        if (this.table === 'resources') { t.updated_at = new Date().toISOString(); t.last_edited_by = me()?.id; }
      });
      return { data: null, error: null };
    }
    targets.forEach((t) => rows.splice(rows.indexOf(t), 1));
    return { data: null, error: null };
  }

  then(resolve: (v: any) => any, reject?: (e: any) => any) {
    try { return Promise.resolve(this.run()).then(resolve, reject); } catch (e) { return Promise.reject(e).then(resolve, reject); }
  }
}

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 15));

export const supabase = {
  auth: {
    async getSession() { return { data: { session } }; },
    async getUser() { return { data: { user: session?.user ?? null } }; },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const p = db.profiles.find((x) => x.email === email);
      if (!p || password !== 'senha123') return { data: null, error: { message: 'Invalid login credentials' } };
      session = { user: { id: p.id, email } };
      setTimeout(() => emit('SIGNED_IN'), 0);
      return { data: { session }, error: null };
    },
    async signOut() { session = null; setTimeout(() => emit('SIGNED_OUT'), 0); return { error: null }; },
    onAuthStateChange(cb: (event: string, s: any) => void) {
      listeners.add(cb);
      return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
    },
  },
  from: (table: string) => new Query(table),
  channel() { const c: any = { on: () => c, subscribe: () => c }; return c; },
  removeChannel() {},
  storage: {
    from: () => ({
      async upload() { return delay({ data: {}, error: null }); },
      getPublicUrl: (path: string) => ({ data: { publicUrl: picture + '#' + path } }),
      async createSignedUrl() { return { data: { signedUrl: '#' }, error: null }; },
      async remove() { return { data: [], error: null }; },
    }),
  },
  functions: {
    async invoke(_name: string, { body }: { body: any }) {
      if (body.action === 'create') {
        if (db.profiles.some((p) => p.username === String(body.username).toLowerCase())) return { data: { error: 'Este nome de usuário já está sendo utilizado.' }, error: null };
        db.profiles.push({ id: 'u-' + body.username, name: body.name, username: body.username, role: body.role, team_id: body.team_id, email: body.username + '@painel.example.com' });
      }
      return delay({ data: { ok: true }, error: null });
    },
  },
};
