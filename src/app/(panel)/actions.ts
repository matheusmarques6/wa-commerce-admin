'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createTenant(formData: FormData) {
  const supabase = createAdminClient()
  
  const name = formData.get('name')?.toString() || ''

  const payload = {
    name: name,
    worder_org_id: formData.get('worder_org_id')?.toString() || null,
    shopify_domain: formData.get('shopify_domain')?.toString(),
    timezone: formData.get('timezone')?.toString(),
    max_touches_per_flow: 3,
    recovery_cooldown_hours: 24,
    daily_marketing_limit: 0,
    status: 'active'
  }

  const { data, error } = await supabase.from('tenants').insert([payload]).select().single()
  
  if (error) {
    console.error('Error creating tenant:', error)
    return { error: error.message }
  }

  revalidatePath('/tenants')
  return { success: true, id: data?.id }
}

export async function updateTenant(formData: FormData) {
  const supabase = createAdminClient()
  const id = formData.get('id')?.toString()

  if (!id) return { error: 'ID da loja não encontrado' }
  
  const payload: any = {
    name: formData.get('name')?.toString(),
    shopify_domain: formData.get('shopify_domain')?.toString(),
    timezone: formData.get('timezone')?.toString(),
  }

  const worder_org_id = formData.get('worder_org_id')?.toString()
  if (worder_org_id !== undefined) {
    payload.worder_org_id = worder_org_id === '' ? null : worder_org_id
  }

  const { error } = await supabase.from('tenants').update(payload).eq('id', id)
  
  if (error) {
    console.error('Error updating tenant:', error)
    return { error: error.message }
  }

  revalidatePath('/tenants')
  return { success: true }
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
    trigger_event: formData.get('trigger_event')?.toString() || null,
    content: formData.get('content')?.toString() || null,
    customer_emotional_state: formData.get('customer_emotional_state')?.toString(),
  }

  const { error } = await supabase.from('prompts').insert([payload])

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
    trigger_event: formData.get('trigger_event')?.toString() || null,
    content: formData.get('content')?.toString() || null,
    customer_emotional_state: formData.get('customer_emotional_state')?.toString(),
  }
  const { error } = await supabase.from('prompts').insert([payload])

  if (error) {
    console.error('Error creating prompt override:', error)
    return { error: error.message }
  }

  revalidatePath('/prompts')
  return { success: true }
}

export async function linkWhatsAppAccount(formData: FormData) {
  const supabase = createAdminClient()

  const display_phone_number = formData.get('display_phone_number')?.toString()
  const phone_number_id = formData.get('phone_number_id')?.toString()
  
  let metadata = null
  if (display_phone_number || phone_number_id) {
    metadata = {
      display_phone_number: display_phone_number || '',
      phone_number_id: phone_number_id || ''
    }
  }

  const payload: any = {
    tenant_id: formData.get('tenant_id')?.toString(),
    phone_number: formData.get('phone_number')?.toString(),
    quality_rating: 'GREEN',
    is_active: formData.get('is_active') === 'on'
  }

  if (metadata) {
    payload.metadata = metadata
  }

  const { error } = await supabase.from('whatsapp_accounts').insert([payload])

  if (error) {
    console.error('Error linking whatsapp:', error)
    return { error: error.message }
  }

  revalidatePath('/tenants')
  return { success: true }
}
