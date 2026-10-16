// Camada de dados (Supabase). Converte as linhas do banco (snake_case, ids de usuário em uuid)
// para o formato que as telas já usam, e concentra todas as gravações.
import { supabase } from './supabase';
import { ACCEPTED_IMAGE_TYPES, MAX_INPUT_BYTES, MAX_OUTPUT_BYTES, extensionFor, shrinkImage } from './imageTools';

// Precisa ser igual ao de supabase/functions/admin-users/index.ts
export const EMAIL_DOMAIN = 'painel.example.com';

// "carlos" -> carlos@painel.example.com ; quem digita um e-mail (ex.: o administrador) entra com ele.
export const toEmail = (login: string) => {
  const v = login.trim().toLowerCase();
  return v.includes('@') ? v : `${v}@${EMAIL_DOMAIN}`;
};

const byId = (a: any, b: any) => a.id - b.id;
const fail = (error: any): never => {
  throw new Error(error?.message || 'Erro ao falar com o servidor.');
};

/* ---------------------------- autenticação ---------------------------- */

export async function signIn(login: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: toEmail(login), password });
  if (error) {
    throw new Error(/invalid login credentials/i.test(error.message) ? 'Usuário ou senha incorretos.' : error.message);
  }
}

export const signOut = () => supabase.auth.signOut();

export type Profile = {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'tecnico' | 'conteudista';
  teamId: number | null;
};

const mapProfile = (p: any): Profile => ({ id: p.id, name: p.name, username: p.username, role: p.role, teamId: p.team_id });

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) fail(error);
  return data ? mapProfile(data) : null;
}

/* ------------------------------ leitura ------------------------------- */

export function mapDiscipline(row: any, nameOf: Map<string, string>) {
  const who = (id: string | null) => (id && nameOf.get(id)) || '—';
  return {
    id: row.id,
    title: row.title,
    conteudistaId: row.conteudista_id,
    teamId: row.team_id,
    stage: row.stage,
    stageDone: row.stage_done || {},
    materials: (row.materials || []).sort(byId).map((m: any) => ({
      id: m.id,
      name: m.name,
      date: m.created_at,
      sender: who(m.sender_id),
      status: m.status,
      storagePath: m.storage_path,
    })),
    pendencies: (row.pendencies || []).sort(byId).map((p: any) => ({
      id: p.id,
      text: p.text,
      status: p.status,
      type: p.type,
      author: who(p.author_id),
      comments: (p.pendency_comments || []).sort(byId).map((c: any) => ({
        id: c.id,
        author: who(c.author_id),
        text: c.text,
        date: new Date(c.created_at).toLocaleDateString('pt-BR'),
      })),
    })),
    tasks: (row.tasks || []).sort(byId).map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      dueDate: t.due_date || '',
      stage: t.stage,
      done: t.done,
      createdBy: who(t.created_by),
      createdAt: t.created_at,
    })),
    resources: (row.resources || []).sort(byId).map((r: any) => ({
      id: r.id,
      lesson: r.lesson,
      status: r.status,
      feedback: r.feedback || '',
      authorId: r.author_id,
      author: who(r.author_id),
      lastEditedBy: who(r.last_edited_by),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
  };
}

// Tudo o que o usuário logado pode ver (as regras RLS do banco filtram por equipe/perfil).
export async function loadAll() {
  const [teams, profiles, disciplines] = await Promise.all([
    supabase.from('teams').select('*').order('id'),
    supabase.from('profiles').select('*').order('name'),
    supabase
      .from('disciplines')
      .select('*, materials(*), pendencies(*, pendency_comments(*)), tasks(*), resources(*)')
      .order('id'),
  ]);
  if (teams.error) fail(teams.error);
  if (profiles.error) fail(profiles.error);
  if (disciplines.error) fail(disciplines.error);

  const users = (profiles.data || []).map(mapProfile);
  const nameOf = new Map<string, string>(users.map((u) => [u.id, u.name]));
  return {
    teams: (teams.data || []).map((t: any) => ({ id: t.id as number, name: t.name as string })),
    users,
    disciplines: (disciplines.data || []).map((d: any) => mapDiscipline(d, nameOf)),
  };
}

/* ------------------------- equipes e membros -------------------------- */

export async function createTeam(name: string) {
  const { data, error } = await supabase.from('teams').insert({ name }).select().single();
  if (error) fail(/duplicate|unique/i.test(error.message) ? { message: 'Já existe uma equipe com esse nome.' } : error);
  return { id: data.id as number, name: data.name as string };
}

// Criação de usuários passa pela Edge Function (precisa da chave de serviço, que nunca fica no navegador).
async function callAdminUsers(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('admin-users', { body });
  if (error) {
    let message = error.message;
    try {
      const ctx = (error as any).context;
      if (ctx && typeof ctx.json === 'function') message = (await ctx.json())?.error || message;
    } catch { /* mantém a mensagem padrão */ }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function createMember(m: { name: string; username: string; password: string; role: string; teamId: number }) {
  await callAdminUsers({ action: 'create', name: m.name, username: m.username, password: m.password, role: m.role, team_id: m.teamId });
  return true;
}

export async function setMemberPassword(userId: string, password: string) {
  await callAdminUsers({ action: 'set_password', user_id: userId, password });
  return true;
}

/* ------------------------ disciplinas e Kanban ------------------------ */

export async function createDiscipline(d: { title: string; conteudistaId: string }) {
  const { data, error } = await supabase
    .from('disciplines')
    .insert({ title: d.title, conteudista_id: d.conteudistaId })
    .select('id')
    .single();
  if (error) fail(error);
  return data.id as number;
}

export async function updateDiscipline(id: number, patch: { stage?: string; stage_done?: Record<string, boolean> }) {
  const { error } = await supabase.from('disciplines').update(patch).eq('id', id);
  if (error) fail(error);
  return true;
}

// Apaga a disciplina e, em cascata, tarefas, materiais, pendências, comentários e recursos (só o administrador, via RLS).
export async function deleteDiscipline(id: number) {
  const { data, error } = await supabase.from('disciplines').delete().eq('id', id).select('id');
  if (error) fail(error);
  if (!data || data.length === 0) throw new Error('Não foi possível excluir a disciplina (apenas o administrador pode).');
  return true;
}

export async function addTask(t: { disciplineId: number; title: string; description?: string; dueDate?: string; stage: string; createdBy: string }) {
  const { error } = await supabase.from('tasks').insert({
    discipline_id: t.disciplineId,
    title: t.title,
    description: t.description || '',
    due_date: t.dueDate || null,
    stage: t.stage,
    created_by: t.createdBy,
  });
  if (error) fail(error);
  return true;
}

export async function updateTask(id: number, patch: { done?: boolean; stage?: string }) {
  const { error } = await supabase.from('tasks').update(patch).eq('id', id);
  if (error) fail(error);
  return true;
}

export async function removeTask(id: number) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) fail(error);
  return true;
}

/* --------------------------- materiais de apoio ----------------------- */

const safeName = (n: string) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-80);

export async function addMaterial(m: { disciplineId: number; name: string; file?: File | null; senderId: string }) {
  let storagePath: string | null = null;
  let size: number | null = null;
  if (m.file) {
    storagePath = `${m.disciplineId}/${crypto.randomUUID()}-${safeName(m.file.name)}`;
    const up = await supabase.storage.from('materiais').upload(storagePath, m.file, { upsert: false });
    if (up.error) fail(up.error);
    size = m.file.size;
  }
  const { error } = await supabase.from('materials').insert({
    discipline_id: m.disciplineId,
    name: m.name,
    storage_path: storagePath,
    size_bytes: size,
    sender_id: m.senderId,
  });
  if (error) {
    if (storagePath) await supabase.storage.from('materiais').remove([storagePath]);
    fail(error);
  }
  return true;
}

export async function updateMaterialStatus(id: number, status: string) {
  const { error } = await supabase.from('materials').update({ status }).eq('id', id);
  if (error) fail(error);
  return true;
}

// Link temporário (1 h) para baixar o arquivo do bucket privado.
export async function materialUrl(path: string) {
  const { data, error } = await supabase.storage.from('materiais').createSignedUrl(path, 3600);
  if (error) fail(error);
  return data.signedUrl as string;
}

/* ----------------------------- pendências ----------------------------- */

export async function addPendency(p: { disciplineId: number; text: string; type: string; authorId: string }) {
  const { error } = await supabase
    .from('pendencies')
    .insert({ discipline_id: p.disciplineId, text: p.text, type: p.type, author_id: p.authorId });
  if (error) fail(error);
  return true;
}

export async function resolvePendency(id: number) {
  const { error } = await supabase.from('pendencies').update({ status: 'resolvida' }).eq('id', id);
  if (error) fail(error);
  return true;
}

export async function addComment(c: { pendencyId: number; text: string; authorId: string }) {
  const { error } = await supabase
    .from('pendency_comments')
    .insert({ pendency_id: c.pendencyId, text: c.text, author_id: c.authorId });
  if (error) fail(error);
  return true;
}

/* ------------------------- Editor Estrutural -------------------------- */

export async function addResource(r: { disciplineId: number; lesson: unknown; authorId: string }) {
  const { data, error } = await supabase
    .from('resources')
    .insert({ discipline_id: r.disciplineId, lesson: r.lesson, author_id: r.authorId, status: 'rascunho' })
    .select('id')
    .single();
  if (error) fail(error);
  return data.id as number;
}

export async function updateResource(id: number, patch: { lesson?: unknown; status?: string; feedback?: string }) {
  const row: Record<string, unknown> = {};
  if (patch.lesson !== undefined) row.lesson = patch.lesson;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.feedback !== undefined) row.feedback = patch.feedback;
  if (Object.keys(row).length === 0) return true;
  const { error } = await supabase.from('resources').update(row).eq('id', id);
  if (error) fail(error);
  return true;
}

export async function removeResource(id: number) {
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) fail(error);
  return true;
}

/* ------------------------ imagens das aulas --------------------------- */

// Envia a imagem para o bucket público "aulas-imagens" e devolve o link público.
export async function uploadLessonImage(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('Use uma imagem JPG, PNG, WebP ou GIF.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('A imagem passa de 10 MB. Escolha uma menor.');
  const prepared = await shrinkImage(file);
  if (prepared.size > MAX_OUTPUT_BYTES) throw new Error('A imagem continua acima de 5 MB mesmo reduzida. Escolha uma menor.');

  const { data: auth } = await supabase.auth.getUser();
  const folder = auth.user?.id ?? 'anon';
  const path = `${folder}/${crypto.randomUUID()}.${extensionFor(prepared.type)}`;
  const up = await supabase.storage
    .from('aulas-imagens')
    .upload(path, prepared, { contentType: prepared.type, cacheControl: '31536000', upsert: false });
  if (up.error) fail(up.error);
  return supabase.storage.from('aulas-imagens').getPublicUrl(path).data.publicUrl;
}
