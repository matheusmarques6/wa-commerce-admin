'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createTenant(formData: FormData) {
  const supabase = createAdminClient()
  
  const name = formData.get('name')?.toString() || ''
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const payload = {
    name: name,
    slug: slug,
    shopify_domain: formData.get('shopify_domain')?.toString(),
    timezone: formData.get('timezone')?.toString(),
    max_touches_per_flow: 3,
    recovery_cooldown_hours: 24,
    daily_marketing_limit: 0,
    status: 'active',
    plan: 'starter'
  }

  const { data, error } = await supabase.from('tenants').insert([payload]).select().single()
  
  if (error) {
    console.error('Error creating tenant:', error)
    return { error: error.message }
  }

  revalidatePath('/tenants')
  return { success: true, id: data?.id }
}

export async function createAgent(formData: FormData) {
  const supabase = createAdminClient()
  
  const payload = {
    name: formData.get('name')?.toString(),
    tenant_id: formData.get('tenant_id')?.toString(),
    type: formData.get('type')?.toString(),
    briefing: formData.get('briefing')?.toString(),
    tone_of_voice: formData.get('tone_of_voice')?.toString(),
    config_version: 1,
    is_active: true,
    is_default: formData.get('is_default') === 'on'
  }

  const { error } = await supabase.from('agents').insert([payload])
  
  if (error) {
    console.error('Error creating agent:', error)
    return { error: error.message }
  }

  revalidatePath('/agents')
  return { success: true }
}

export async function createRecoveryPromptDefault(formData: FormData) {
  const supabase = createAdminClient()

  const payload = {
    flow_type: formData.get('flow_type')?.toString(),
    touch_number: Number(formData.get('touch_number')),
    brunson_framework: formData.get('brunson_framework')?.toString(),
    label: formData.get('label')?.toString(),
    message_type: formData.get('message_type')?.toString(),
    delay_minutes: Number(formData.get('delay_minutes')),
    customer_emotional_state: formData.get('customer_emotional_state')?.toString(),
    is_active: true
  }

  const { error } = await supabase.from('recovery_prompts_defaults').insert([payload])

  if (error) {
    console.error('Error creating default prompt:', error)
    return { error: error.message }
  }

  revalidatePath('/prompts')
  return { success: true }
}

export async function createRecoveryPromptOverride(formData: FormData) {
  const supabase = createAdminClient()

  const payload = {
    tenant_id: formData.get('tenant_id')?.toString(),
    flow_type: formData.get('flow_type')?.toString(),
    touch_number: Number(formData.get('touch_number')),
    brunson_framework: formData.get('brunson_framework')?.toString(),
    label: formData.get('label')?.toString(),
    message_type: formData.get('message_type')?.toString(),
    delay_minutes: Number(formData.get('delay_minutes')),
    customer_emotional_state: formData.get('customer_emotional_state')?.toString(),
    is_active: true
  }
  const { error } = await supabase.from('recovery_prompts').insert([payload])

  if (error) {
    console.error('Error creating prompt override:', error)
    return { error: error.message }
  }

  revalidatePath('/prompts')
  return { success: true }
}

export async function linkWhatsAppAccount(formData: FormData) {
  const supabase = createAdminClient()

  const payload = {
    tenant_id: formData.get('tenant_id')?.toString(),
    phone_number: formData.get('phone_number')?.toString(),
    quality_rating: 'GREEN',
    is_active: formData.get('is_active') === 'on'
  }

  const { error } = await supabase.from('whatsapp_accounts').insert([payload])

  if (error) {
    console.error('Error linking whatsapp:', error)
    return { error: error.message }
  }

  revalidatePath('/tenants')
  return { success: true }
}
