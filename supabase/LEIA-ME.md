# Banco de dados (Supabase) — passo a passo

O painel guarda tudo no Supabase: login, equipes, disciplinas, Kanban, tarefas, materiais
(arquivos de verdade), pendências/fórum e as aulas do Editor Estrutural. O banco começa **vazio**.

## 1. Criar as tabelas e as regras de acesso
Supabase › **SQL Editor** › New query › cole o conteúdo de `schema.sql` › **Run**.
(Pode rodar de novo sem problema.)

## 2. Criar o administrador
Mesma tela: cole o conteúdo de `seed.local.sql` › **Run**.
Esse arquivo fica só no seu computador (o Git ignora). Ele cria o login
`adm@email.com` e o perfil de administrador. **Troque a senha depois do primeiro acesso.**

> Se der erro de login com esse método, crie pelo painel: Authentication › Users › Add user
> (e-mail + senha, marque *Auto Confirm User*) e rode `seed.sql`.

## 3. Publicar a função que cria usuários
Supabase › **Edge Functions** › Deploy a new function › nome **`admin-users`** ›
cole `functions/admin-users/index.ts` › Deploy.
Ela usa a chave de serviço no servidor — essa chave nunca vai para o site.

## 4. Ajustes de segurança (Authentication)
- **Sign In / Providers › Email**: desligue *Allow new users to sign up* (só o administrador cria contas).
- Senha mínima padrão é 6 caracteres; use senhas fortes.

## 5. Entrar
Abra o painel e entre com `adm@email.com`. Em **Equipes**, crie a equipe e cadastre os membros
(suporte técnico e conteudistas). Eles entram com o **usuário** que você definir (por baixo vira
`usuario@painel.example.com`).

## Quem vê o quê (aplicado pelo banco, não só pela tela)
| Perfil | Acesso |
|---|---|
| Administrador | tudo, de todas as equipes |
| Suporte técnico | disciplinas e conteudistas da **própria equipe** |
| Conteudista | só as próprias disciplinas |

## Variáveis do site (`.env`)
`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` são chaves **públicas**.
Nunca coloque a *secret / service_role key* no site.
