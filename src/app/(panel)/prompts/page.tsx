import { createAdminClient } from '@/lib/supabase-server'
import CreatePromptModal from './CreatePromptModal'

const eventLabels: Record<string, string> = {
  carrinho_criado: 'Carrinho Criado',
  carrinho_atualizado: 'Carrinho Atualizado',
  checkout_criado: 'Checkout Criado',
  checkout_atualizado: 'Checkout Atualizado',
  checkout_deletado: 'Checkout Deletado',
  pedido_criado: 'Pedido Criado',
  pedido_pago: 'Pedido Pago',
  pedido_concluido: 'Pedido Concluído',
  pedido_cancelado: 'Pedido Cancelado',
  reembolso_criado: 'Reembolso Criado',
}

function eventGroup(ev: string | null | undefined): string {
  if (!ev) return 'SEM EVENTO'
  if (ev.startsWith('carrinho')) return 'CARRINHO'
  if (ev.startsWith('checkout')) return 'CHECKOUT'
  if (ev.startsWith('pedido')) return 'PEDIDO'
  if (ev.startsWith('reembolso')) return 'REEMBOLSO'
  return 'OUTROS'
}

export default async function PromptsPage() {
  const supabase = createAdminClient()

  const [{ data: prompts }, { data: tenants }] = await Promise.all([
    supabase.from('prompts').select('*, tenants(name)').order('trigger_event'),
    supabase.from('tenants').select('id, name').order('name')
  ])

  const all = prompts || []
  const defaults = all.filter((p: any) => !p.tenant_id)
  const overrides = all.filter((p: any) => p.tenant_id)

  const groups = [...new Set(defaults.map((p: any) => eventGroup(p.trigger_event)))]

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Recovery Prompts</h2>
          <p className="text-sm" style={{ color: '#8888a0' }}>Defaults do playbook + overrides por loja</p>
        </div>
        <CreatePromptModal tenants={tenants || []} />
      </div>

      <div className="mb-6 rounded-xl p-5" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Defaults do playbook ({defaults.length} prompts)</h3>

        {defaults.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: '#5a5a72' }}>Nenhum prompt default cadastrado.</p>
        ) : (
          groups.map((g: string) => {
            const items = defaults.filter((p: any) => eventGroup(p.trigger_event) === g)
            return (
              <div key={g} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold" style={{ background: '#a855f718', color: '#a855f7' }}>{g}</span>
                  <span className="text-xs" style={{ color: '#5a5a72' }}>{items.length} prompts</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {items.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                      <div className="p-3">
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {p.trigger_event && <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#3b82f618', color: '#3b82f6' }}>{eventLabels[p.trigger_event] || p.trigger_event}</span>}
                        </div>
                        <div className="text-[11px] leading-relaxed line-clamp-3 mb-2" style={{ color: '#8888a0' }}>{p.customer_emotional_state}</div>
                        {p.content && <div className="text-[10px] leading-relaxed line-clamp-3 pt-2 border-t" style={{ color: '#5a5a72', borderColor: '#2a2a3e44' }}>{p.content.replace(/[#*`>_\[\]]/g, '').trim()}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="rounded-xl p-5" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Overrides por loja ({overrides.length})</h3>
        {overrides.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: '#5a5a72' }}>Nenhuma loja customizou prompts ainda. Usando defaults.</p>
        ) : (
          <div className="grid gap-2">
            {overrides.map((o: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold" style={{ color: '#e8e8f0' }}>{o.tenants?.name}</span>
                  {o.trigger_event && <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#3b82f618', color: '#3b82f6' }}>{eventLabels[o.trigger_event] || o.trigger_event}</span>}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#22c55e18', color: '#22c55e' }}>override</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
