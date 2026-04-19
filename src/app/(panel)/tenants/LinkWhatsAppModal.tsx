'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { linkWhatsAppAccount } from '../actions'

interface Props {
  tenantId: string
}

export default function LinkWhatsAppModal({ tenantId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('tenant_id', tenantId) // Injetando o tenant explicitamente no payload

    const result = await linkWhatsAppAccount(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setIsOpen(false)
    }
  }

  function handleClose() {
    setIsOpen(false)
    setTimeout(() => setError(''), 300)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[11px] font-semibold flex items-center gap-1.5 px-2 py-1 rounded transition-colors hover:bg-white/5"
        style={{ color: '#22c55e', border: '1px dashed #22c55e44' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Registrar Número
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Vincular Novo WhatsApp">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Número Principal (Com Código do País)</label>
            <input 
              name="phone_number" 
              required 
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 font-mono" 
              style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} 
              placeholder="+5511999999999" 
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#8888a0' }}>Este é o número que identificará esta Loja no n8n. Remova hifens ou pontuação, apenas números e o +.</p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="is_active" name="is_active" defaultChecked className="rounded" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', accentColor: '#22c55e' } as any} />
            <label htmlFor="is_active" className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>Contabilizar este número como Ativo</label>
          </div>

          <div className="mt-2 pt-4 border-t" style={{ borderColor: '#2a2a3e' }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#8888a0' }}>Meta Cloud API (Opcional)</h4>
            <div className="grid gap-3">
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Display Phone Number</label>
                <input 
                  name="display_phone_number" 
                  className="w-full px-3 py-1.5 rounded-lg text-sm outline-none focus:ring-2 font-mono" 
                  style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} 
                  placeholder="Ex: 553175080404" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Phone Number ID</label>
                <input 
                  name="phone_number_id" 
                  className="w-full px-3 py-1.5 rounded-lg text-sm outline-none focus:ring-2 font-mono" 
                  style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} 
                  placeholder="Ex: 1050081151524604" 
                />
              </div>
            </div>
          </div>

          {error && <div className="p-3 rounded-lg text-sm mt-1" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#8888a0' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Vincular Número'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
