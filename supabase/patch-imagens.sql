-- Limites do bucket de imagens das aulas: até 5 MB e só JPG, PNG, WebP e GIF.
-- (Já incluído no schema.sql. Rode só este trecho se você já rodou o schema antes.)
update storage.buckets
   set file_size_limit = 5242880,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'aulas-imagens';
