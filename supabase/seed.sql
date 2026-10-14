-- Primeiro administrador (modelo SEM senha — pode ficar no GitHub).
-- Se preferir criar o login pelo painel do Supabase:
--   Authentication > Users > Add user > e-mail + senha, marque "Auto Confirm User".
-- Depois rode este arquivo trocando o e-mail abaixo (banco limpo: não cria equipes nem disciplinas).

insert into public.profiles (id, name, username, role)
select id, 'Administrador', 'administrador', 'admin'
from auth.users
where email = 'adm@email.com'
on conflict (id) do update set name = excluded.name, role = 'admin';
