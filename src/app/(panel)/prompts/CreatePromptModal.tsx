'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { createRecoveryPromptDefault, createRecoveryPromptOverride } from '../actions'

interface Tenant {
  id: string
  name: string
}

interface Props {
  tenants: Tenant[]
}

const flowTypes = [
  { id: 'cart_abandoned', label: 'Carrinho Abandonado' },
  { id: 'checkout_abandoned', label: 'Checkout Abandonado' },
  { id: 'pix_expired', label: 'PIX Vencido' },
  { id: 'boleto_pending', label: 'Boleto Pendente' },
  { id: 'browse_abandoned', label: 'Browse Abandoned' },
  { id: 'post_delivery_crosssell', label: 'Cross-sell Pós-entrega' },
  { id: 'post_delivery_tracking', label: 'Rastreio/Tracking' }
]

const frameworks = ['hook', 'story', 'offer', 'hook_story', 'hook_offer', 'story_offer', 'utility']

const triggerEvents: { group: string; options: { id: string; label: string }[] }[] = [
  { group: 'CARRINHO', options: [
    { id: 'carrinho_criado', label: 'Carrinho Criado' },
    { id: 'carrinho_atualizado', label: 'Carrinho Atualizado' },
  ]},
  { group: 'CHECKOUT', options: [
    { id: 'checkout_criado', label: 'Checkout Criado' },
    { id: 'checkout_atualizado', label: 'Checkout Atualizado' },
    { id: 'checkout_deletado', label: 'Checkout Deletado' },
  ]},
  { group: 'PEDIDO', options: [
    { id: 'pedido_criado', label: 'Pedido Criado' },
    { id: 'pedido_pago', label: 'Pedido Pago' },
    { id: 'pedido_concluido', label: 'Pedido Concluído' },
    { id: 'pedido_cancelado', label: 'Pedido Cancelado' },
  ]},
  { group: 'REEMBOLSO', options: [
    { id: 'reembolso_criado', label: 'Reembolso Criado' },
  ]},
]

export default function CreatePromptModal({ tenants }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState<'default' | 'override'>('default')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    let result
    if (type === 'default') {
      result = await createRecoveryPromptDefault(formData)
    } else {
      result = await createRecoveryPromptOverride(formData)
    }

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
        style={{ background: '#22c55e', color: '#000' }}
      >
        + Novo Prompt
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cadastrar Recovery Prompt">
        <div className="flex gap-2 mb-5">
          <button 
            onClick={() => setType('default')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${type === 'default' ? 'bg-[#22c55e18] text-[#22c55e] border-[#22c55e33]' : 'bg-[#0c0c14] text-[#8888a0] border-[#2a2a3e]'}`}
          >
            Default Playbook
          </button>
          <button 
            onClick={() => setType('override')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${type === 'override' ? 'bg-[#a855f718] text-[#a855f7] border-[#a855f733]' : 'bg-[#0c0c14] text-[#8888a0] border-[#2a2a3e]'}`}
          >
            Override por Loja
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type === 'override' && (
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Loja Específica</label>
              <select name="tenant_id" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="">Selecione uma loja...</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Tipo do Fluxo</label>
              <select name="flow_type" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="">Selecione...</option>
                {flowTypes.map(ft => <option key={ft.id} value={ft.id}>{ft.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Número do Toque</label>
              <input type="number" name="touch_number" required min="1" max="10" defaultValue="1" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Evento Gatilho (Webhook Shopify)</label>
            <select name="trigger_event" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
              <option value="">Selecione o evento...</option>
              {triggerEvents.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Brunson Framework</label>
              <select name="brunson_framework" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="">Selecione...</option>
                {frameworks.map(fw => <option key={fw} value={fw}>{fw}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Tipo de Mensagem</label>
              <select name="message_type" required defaultValue="conversational" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="conversational">Conversational</option>
                <option value="utility">Utility</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Delay (minutos desde o evento)</label>
            <input type="number" name="delay_minutes" required defaultValue="15" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Label Interna</label>
            <input name="label" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: T1 (Hook) - Abordagem inicial" />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Estado Emocional do Cliente (Diretriz)</label>
            <textarea name="customer_emotional_state" required rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 resize-none" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: Cliente está quente, mas possivelmente se distraiu na hora do checkout. Foco na escassez." />
          </div>

          {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#8888a0' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Salvar Prompt'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
