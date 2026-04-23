import { createAdminClient } from '@/lib/supabase-server'
import CreatePromptModal from './CreatePromptModal'
import EditPromptModal from './EditPromptModal'

export const dynamic = 'force-dynamic'

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

  const [promptsResponse, tenantsResponse] = await Promise.all([
    supabase.from('prompts').select('*, tenants(name)').order('evento'),
    supabase.from('tenants').select('id, name').order('name')
  ])

  if (promptsResponse.error) {
    console.error('Error fetching prompts:', promptsResponse.error)
    return (
      <div className="p-5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500">
        <h3 className="font-bold mb-2">Erro ao carregar prompts</h3>
        <p className="font-mono text-sm">{promptsResponse.error.message}</p>
        <pre className="mt-4 p-4 bg-black/50 rounded text-xs overflow-auto">
          {JSON.stringify(promptsResponse.error, null, 2)}
        </pre>
      </div>
    )
  }

  const prompts = promptsResponse.data
  const tenants = tenantsResponse.data

  const all = prompts || []
  const groups = [...new Set(all.map((p: any) => eventGroup(p.evento)))]

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Prompts</h2>
          <p className="text-sm" style={{ color: '#8888a0' }}>Prompts por loja agrupados por evento gatilho</p>
        </div>
        <CreatePromptModal tenants={tenants || []} />
      </div>

      <div className="rounded-xl p-5" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Total ({all.length} prompts)</h3>

        {all.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: '#5a5a72' }}>Nenhum prompt cadastrado.</p>
        ) : (
          groups.map((g: string) => {
            const items = all.filter((p: any) => eventGroup(p.evento) === g)
            return (
              <div key={g} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold" style={{ background: '#a855f718', color: '#a855f7' }}>{g}</span>
                  <span className="text-xs" style={{ color: '#5a5a72' }}>{items.length} prompts</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {items.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg p-3 relative group" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditPromptModal tenants={tenants || []} prompt={p} />
                      </div>
                      <div className="flex items-center justify-between mb-2 pr-12">
                        <span className="text-xs font-semibold" style={{ color: '#e8e8f0' }}>{p.tenants?.name || '—'}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: '#2a2a3e', color: '#8888a0' }}>v{p.version}</span>
                      </div>
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {p.evento && <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#3b82f618', color: '#3b82f6' }}>{eventLabels[p.evento] || p.evento}</span>}
                      </div>
                      <div className="text-[11px] leading-relaxed line-clamp-3" style={{ color: '#8888a0' }}>{p.customer_emotional_state}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
