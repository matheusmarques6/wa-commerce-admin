'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { createTenant } from '../actions'

export default function CreateTenantModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createTenant(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccessId(result.id)
    }
  }

  function handleClose() {
    setIsOpen(false)
    // reset form state when closing
    setTimeout(() => { setSuccessId(null); setError('') }, 300)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
        style={{ background: '#22c55e', color: '#000' }}
      >
        + Nova Loja
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title={successId ? "Loja Criada com Sucesso!" : "Cadastrar Nova Loja"}>
        {successId ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#22c55e18', color: '#22c55e' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#e8e8f0' }}>Loja Registrada</h3>
            <p className="text-sm mb-6" style={{ color: '#8888a0' }}>Este é o **ID Único** da loja no banco de dados. Ele já foi atrelado no sistema e está pronto para uso.</p>
            
            <div className="w-full p-4 rounded-xl mb-6 flex flex-col gap-2" style={{ background: '#0c0c14', border: '1px dashed #2a2a3e' }}>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#5a5a72' }}>TENANT ID</span>
              <code className="text-sm font-mono break-all select-all text-center" style={{ color: '#22c55e' }}>{successId}</code>
            </div>

            <button onClick={handleClose} className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000' }}>
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Nome da Loja</label>
              <input name="name" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: Convertfy Store" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Domínio Shopify</label>
              <input name="shopify_domain" required className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="minhaloja.myshopify.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Timezone</label>
              <input name="timezone" defaultValue="America/Sao_Paulo" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Max Toques/Fluxo</label>
                <input type="number" name="max_touches_per_flow" required defaultValue="3" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Cooldown (Horas)</label>
                <input type="number" name="recovery_cooldown_hours" required defaultValue="24" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Limite Marketing/Dia (0 = sem limite)</label>
              <input type="number" name="daily_marketing_limit" defaultValue="0" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
            </div>

            {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#8888a0' }}>Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Salvando...' : 'Salvar Loja'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
