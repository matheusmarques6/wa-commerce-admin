-- Limpa a tabela prompts: remove colunas de template, segmentação, A/B e o content duplicado
-- Mantém: version (versionamento do prompt)
-- Rodar no SQL Editor do Supabase

ALTER TABLE prompts
  DROP COLUMN IF EXISTS use_template,
  DROP COLUMN IF EXISTS template_name,
  DROP COLUMN IF EXISTS value_segment,
  DROP COLUMN IF EXISTS ab_variant,
  DROP COLUMN IF EXISTS traffic_percentage,
  DROP COLUMN IF EXISTS content;

-- Remove também as constraints de check das colunas já dropadas
ALTER TABLE prompts
  DROP CONSTRAINT IF EXISTS recovery_prompts_ab_variant_check,
  DROP CONSTRAINT IF EXISTS recovery_prompts_traffic_percentage_check,
  DROP CONSTRAINT IF EXISTS recovery_prompts_value_segment_check;
