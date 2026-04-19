'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { createAgent } from '../actions'

interface Tenant {
  id: string
  name: string
}

interface Props {
  tenants: Tenant[]
}

export default function CreateAgentModal({ tenants }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createAgent(formData)

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
        + Novo Agente
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cadastrar Agente IA">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Nome do Agente</label>
            <input name="name" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: Ana Vendedora" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Loja (Tenant)</label>
              <select name="tenant_id" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="">Selecione uma loja...</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Tipo do Agente</label>
              <select name="type" required defaultValue="recovery" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}>
                <option value="recovery">Recuperação</option>
                <option value="sales">Vendas</option>
                <option value="support">Suporte</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Tom de Voz (Tone of Voice)</label>
            <input name="tone_of_voice" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: Amigável, direta, usa emojis ocasionalmente" />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Briefing / Funcionalidade</label>
            <textarea name="briefing" required rows={4} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 resize-none" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: O agente deve responder objeções de clientes com boleto vencido..." />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_default" name="is_default" defaultChecked className="rounded" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', accentColor: '#22c55e' } as any} />
            <label htmlFor="is_default" className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>Definir como agente Default para esse tipo</label>
          </div>

          {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#8888a0' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Criando...' : 'Salvar Agente'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
