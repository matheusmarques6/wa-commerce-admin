'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { updateTenant } from '../actions'

interface Props {
  tenant: {
    id: string
    name: string
    shopify_domain: string
    timezone: string
    worder_org_id: string | null
  }
}

export default function EditTenantModal({ tenant }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('id', tenant.id)
    
    const result = await updateTenant(formData)

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
        className="text-gray-400 hover:text-white transition-colors"
        title="Editar Loja"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Editar Loja">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Nome da Loja</label>
            <input name="name" required defaultValue={tenant.name} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: Convertfy Store" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Domínio Shopify</label>
            <input name="shopify_domain" required defaultValue={tenant.shopify_domain} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="minhaloja.myshopify.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Timezone</label>
            <input name="timezone" required defaultValue={tenant.timezone || "America/Sao_Paulo"} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Worder Org ID (Opcional)</label>
            <input name="worder_org_id" defaultValue={tenant.worder_org_id || ''} className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 font-mono" style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any} placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000" />
            <p className="text-[10px] mt-1" style={{ color: '#5a5a72' }}>ID de integração da organização originária na infraestrutura Worder.</p>
          </div>
          
          {error && <div className="p-3 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#8888a0' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity" style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
