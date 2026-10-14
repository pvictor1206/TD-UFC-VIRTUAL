// Edge Function "admin-users": cria/atualiza/remove usuários com a chave de serviço
// (que NUNCA vai para o navegador). Quem pode o quê:
//   - admin:     tudo, em qualquer equipe
//   - tecnico:   cria conteudistas e redefine senha de conteudistas da PRÓPRIA equipe
//   - conteudista: nada
//
// Deploy: Supabase > Edge Functions > Deploy a new function > nome "admin-users" > cole este arquivo.
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente das funções.)
import { createClient } from 'npm:@supabase/supabase-js@2';

const EMAIL_DOMAIN = 'painel.example.com'; // precisa ser igual ao de src/db.ts
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  // 1) quem está chamando
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: auth, error: authError } = await admin.auth.getUser(token);
  if (authError || !auth.user) return json({ error: 'Sessão inválida. Entre novamente.' }, 401);
  const { data: caller } = await admin.from('profiles').select('id, role, team_id').eq('id', auth.user.id).single();
  if (!caller || caller.role === 'conteudista') return json({ error: 'Sem permissão.' }, 403);

  let body: Record<string, any>;
  try { body = await req.json(); } catch { return json({ error: 'Pedido inválido.' }, 400); }

  // 2) ações
  if (body.action === 'create') {
    const name = String(body.name ?? '').trim();
    const username = String(body.username ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const role = String(body.role ?? '');
    const teamId = Number(body.team_id);

    if (!name) return json({ error: 'Informe o nome.' }, 400);
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) return json({ error: 'Usuário: 3 a 30 caracteres (letras, números, ponto, hífen ou sublinhado).' }, 400);
    if (password.length < 6) return json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, 400);
    if (!['tecnico', 'conteudista'].includes(role)) return json({ error: 'Perfil inválido.' }, 400);
    if (!Number.isInteger(teamId)) return json({ error: 'Escolha a equipe.' }, 400);
    if (caller.role === 'tecnico' && (role !== 'conteudista' || teamId !== caller.team_id)) {
      return json({ error: 'O suporte técnico só cadastra conteudistas da própria equipe.' }, 403);
    }
    const { data: team } = await admin.from('teams').select('id').eq('id', teamId).maybeSingle();
    if (!team) return json({ error: 'Equipe não encontrada.' }, 404);
    const { data: taken } = await admin.from('profiles').select('id').ilike('username', username).maybeSingle();
    if (taken) return json({ error: 'Este nome de usuário já está sendo utilizado.' }, 409);

    const { data: created, error } = await admin.auth.admin.createUser({
      email: `${username}@${EMAIL_DOMAIN}`,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error || !created.user) return json({ error: error?.message ?? 'Não foi possível criar o usuário.' }, 400);

    const { error: profileError } = await admin
      .from('profiles')
      .insert({ id: created.user.id, name, username, role, team_id: teamId });
    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id); // desfaz para não deixar login sem perfil
      return json({ error: profileError.message }, 400);
    }
    return json({ ok: true, id: created.user.id });
  }

  if (body.action === 'set_password') {
    const userId = String(body.user_id ?? '');
    const password = String(body.password ?? '');
    if (password.length < 6) return json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, 400);
    const { data: target } = await admin.from('profiles').select('id, role, team_id').eq('id', userId).maybeSingle();
    if (!target) return json({ error: 'Usuário não encontrado.' }, 404);
    if (caller.role === 'tecnico' && !(target.role === 'conteudista' && target.team_id === caller.team_id)) {
      return json({ error: 'Sem permissão para este usuário.' }, 403);
    }
    const { error } = await admin.auth.admin.updateUserById(userId, { password });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  if (body.action === 'delete') {
    if (caller.role !== 'admin') return json({ error: 'Somente o administrador remove usuários.' }, 403);
    const userId = String(body.user_id ?? '');
    if (userId === caller.id) return json({ error: 'Você não pode remover o próprio acesso.' }, 400);
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: 'Ação desconhecida.' }, 400);
});
