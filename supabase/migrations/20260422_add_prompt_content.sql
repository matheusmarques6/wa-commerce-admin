-- Limpa a tabela prompts: mantém apenas conteúdo + vínculo com loja + evento
-- Rodar no SQL Editor do Supabase

ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS content text;

ALTER TABLE prompts
  DROP COLUMN IF EXISTS flow_type,
  DROP COLUMN IF EXISTS label,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS delay_minutes,
  DROP COLUMN IF EXISTS touch_number,
  DROP COLUMN IF EXISTS brunson_framework,
  DROP COLUMN IF EXISTS message_type;
