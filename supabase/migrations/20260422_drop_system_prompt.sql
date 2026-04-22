-- system_prompt fica no agente de IA, não no prompt
-- Rodar no SQL Editor do Supabase

ALTER TABLE prompts
  DROP COLUMN IF EXISTS system_prompt;
