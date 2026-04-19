import { createAdminClient } from '@/lib/supabase-server'
import CreatePromptModal from './CreatePromptModal'

const flowLabels: Record<string, string> = {
  cart_abandoned: 'Carrinho', checkout_abandoned: 'Checkout',
  pix_expired: 'PIX', boleto_pending: 'Boleto',
  browse_abandoned: 'Browse', post_delivery_crosssell: 'Cross-sell',
  post_delivery_tracking: 'Tracking',
}

const frameworkColors: Record<string, string> = {
  hook: '#3b82f6', story: '#a855f7', offer: '#f59e0b',
  hook_story: '#8b5cf6', hook_offer: '#22c55e', story_offer: '#ec4899',
}

export default async function PromptsPage() {
  const supabase = createAdminClient()

  const [{ data: defaults }, { data: overrides }, { data: tenants }] = await Promise.all([
    supabase.from('recovery_prompts_defaults').select('*').eq('is_active', true).order('flow_type').order('touch_number'),
    supabase.from('recovery_prompts').select('*, tenants(name)').eq('is_active', true).order('flow_type').order('touch_number'),
    supabase.from('tenants').select('id, name').order('name')
  ])

  const flowTypes = [...new Set((defaults || []).map((d: any) => d.flow_type))]

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
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Defaults do playbook ({(defaults || []).length} prompts)</h3>

        {flowTypes.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: '#5a5a72' }}>Nenhum prompt default cadastrado. Popule a tabela recovery_prompts_defaults.</p>
        ) : (
          flowTypes.map((ft: string) => {
            const prompts = (defaults || []).filter((d: any) => d.flow_type === ft)
            return (
              <div key={ft} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold" style={{ background: '#a855f718', color: '#a855f7' }}>{flowLabels[ft] || ft}</span>
                  <span className="text-xs" style={{ color: '#5a5a72' }}>{prompts.length} toques</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {prompts.map((p: any, i: number) => (
                    <div key={i} className="rounded-lg overflow-hidden" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                      <div className="flex items-center justify-between px-3 py-2.5" style={{ background: '#1a1a28', borderBottom: '1px solid #2a2a3e44' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold" style={{ background: '#22c55e', color: '#000' }}>{p.touch_number}</div>
                          <span className="text-xs font-medium" style={{ color: '#e8e8f0' }}>Toque {p.touch_number}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: (frameworkColors[p.brunson_framework] || '#888') + '18', color: frameworkColors[p.brunson_framework] || '#888' }}>{p.brunson_framework}</span>
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-medium mb-2" style={{ color: '#e8e8f0' }}>{p.label}</div>
                        <div className="flex gap-1.5 mb-2">
                          <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: p.message_type === 'utility' ? '#22c55e18' : '#f59e0b18', color: p.message_type === 'utility' ? '#22c55e' : '#f59e0b' }}>{p.message_type}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#2a2a3e', color: '#8888a0' }}>{p.delay_minutes}min</span>
                        </div>
                        <div className="text-[11px] leading-relaxed line-clamp-3" style={{ color: '#5a5a72' }}>{p.customer_emotional_state}</div>
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
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Overrides por loja ({(overrides || []).length})</h3>
        {(overrides || []).length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: '#5a5a72' }}>Nenhuma loja customizou prompts ainda. Usando defaults.</p>
        ) : (
          <div className="grid gap-2">
            {(overrides || []).map((o: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold" style={{ color: '#e8e8f0' }}>{o.tenants?.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: '#a855f718', color: '#a855f7' }}>{flowLabels[o.flow_type]}</span>
                  <span className="text-xs" style={{ color: '#5a5a72' }}>Toque {o.touch_number}</span>
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
