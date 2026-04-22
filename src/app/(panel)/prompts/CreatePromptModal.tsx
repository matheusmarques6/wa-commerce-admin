'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Modal from '@/components/Modal'
import { createPrompt } from '../actions'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Tenant { id: string; name: string }
interface Props { tenants: Tenant[] }

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

const inputStyle: React.CSSProperties = {
  background: '#0c0c14',
  border: '1px solid #2a2a3e',
  color: '#e8e8f0',
  ['--tw-ring-color' as any]: '#22c55e',
}

const labelClass = 'block text-xs font-semibold mb-1.5 uppercase tracking-wider'
const labelStyle = { color: '#5a5a72' } as const

function SmallEditor({ value, onChange, height = 140 }: { value: string; onChange: (v: string) => void; height?: number }) {
  return (
    <div data-color-mode="dark">
      <MDEditor value={value} onChange={(v) => onChange(v || '')} height={height} preview="edit" visibleDragbar={false} />
    </div>
  )
}

export default function CreatePromptModal({ tenants }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [emotional, setEmotional] = useState('')
  const [thinking, setThinking] = useState('')
  const [needsHear, setNeedsHear] = useState('')
  const [negative, setNegative] = useState('')
  const [beliefs, setBeliefs] = useState<string[]>([''])
  const [examples, setExamples] = useState<Array<{ cliente: string; agente: string }>>([{ cliente: '', agente: '' }])

  function reset() {
    setEmotional(''); setThinking(''); setNeedsHear('')
    setNegative(''); setBeliefs(['']); setExamples([{ cliente: '', agente: '' }])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('customer_emotional_state', emotional)
    formData.set('customer_thinking', thinking)
    formData.set('customer_needs_to_hear', needsHear)
    formData.set('negative_instructions', negative)
    formData.set('false_beliefs', JSON.stringify(beliefs.filter(b => b.trim())))
    formData.set('dialog_examples', JSON.stringify(examples.filter(ex => ex.cliente.trim() || ex.agente.trim())))

    const result = await createPrompt(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
      reset()
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cadastrar Prompt">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Loja</label>
              <select name="tenant_id" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={inputStyle}>
                <option value="">Selecione uma loja...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Evento Gatilho</label>
              <select name="evento" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={inputStyle}>
                <option value="">Selecione evento...</option>
                {triggerEvents.map(g => (
                  <optgroup key={g.group} label={g.group}>
                    {g.options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 mb-1">
            <div className="h-px flex-1" style={{ background: '#2a2a3e' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8888a0' }}>🧠 Como o cliente está</span>
            <div className="h-px flex-1" style={{ background: '#2a2a3e' }} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Estado Emocional</label>
            <SmallEditor value={emotional} onChange={setEmotional} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>O Que Está Pensando</label>
            <SmallEditor value={thinking} onChange={setThinking} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass} style={labelStyle}>Crenças Falsas</label>
              <button type="button" onClick={() => setBeliefs([...beliefs, ''])} className="text-xs font-semibold" style={{ color: '#22c55e' }}>+ adicionar</button>
            </div>
            <div className="flex flex-col gap-2">
              {beliefs.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input value={b} onChange={(e) => { const n = [...beliefs]; n[i] = e.target.value; setBeliefs(n) }} placeholder={`Crença falsa ${i + 1}`} className="flex-1 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={inputStyle} />
                  {beliefs.length > 1 && <button type="button" onClick={() => setBeliefs(beliefs.filter((_, idx) => idx !== i))} className="px-2 rounded-lg text-xs" style={{ background: '#ef444418', color: '#ef4444' }}>×</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 mb-1">
            <div className="h-px flex-1" style={{ background: '#2a2a3e' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8888a0' }}>🎯 Como agir</span>
            <div className="h-px flex-1" style={{ background: '#2a2a3e' }} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>O Que Precisa Ouvir</label>
            <SmallEditor value={needsHear} onChange={setNeedsHear} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Instruções Negativas (o que NÃO fazer)</label>
            <SmallEditor value={negative} onChange={setNegative} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass} style={labelStyle}>Exemplos de Diálogo</label>
              <button type="button" onClick={() => setExamples([...examples, { cliente: '', agente: '' }])} className="text-xs font-semibold" style={{ color: '#22c55e' }}>+ adicionar</button>
            </div>
            <div className="flex flex-col gap-3">
              {examples.map((ex, i) => (
                <div key={i} className="rounded-lg p-3 relative" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                  {examples.length > 1 && (
                    <button type="button" onClick={() => setExamples(examples.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 w-6 h-6 rounded text-xs" style={{ background: '#ef444418', color: '#ef4444' }}>×</button>
                  )}
                  <div className="mb-2">
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5a5a72' }}>Cliente</div>
                    <textarea value={ex.cliente} onChange={(e) => { const n = [...examples]; n[i].cliente = e.target.value; setExamples(n) }} rows={2} className="w-full px-2 py-1.5 rounded text-sm outline-none focus:ring-2 resize-none" style={inputStyle} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5a5a72' }}>Agente</div>
                    <textarea value={ex.agente} onChange={(e) => { const n = [...examples]; n[i].agente = e.target.value; setExamples(n) }} rows={2} className="w-full px-2 py-1.5 rounded text-sm outline-none focus:ring-2 resize-none" style={inputStyle} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: '#8888a0' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Salvar Prompt'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
