import { createAdminClient } from '@/lib/supabase-server'

const flowLabels: Record<string, string> = {
  cart_abandoned: 'Carrinho', checkout_abandoned: 'Checkout',
  pix_expired: 'PIX', boleto_pending: 'Boleto',
  browse_abandoned: 'Browse', post_delivery_crosssell: 'Cross-sell',
}

const statusColors: Record<string, string> = {
  pending: '#3b82f6', active: '#22c55e', waiting_reply: '#f59e0b',
  paused: '#8888a0', converted: '#22c55e', expired: '#5a5a72', cancelled: '#ef4444',
}

export default async function FlowsPage() {
  const supabase = createAdminClient()
  const { data: flows } = await supabase
    .from('recovery_flows')
    .select('*, contacts(name, phone), tenants(name)')
    .in('status', ['pending','active','waiting_reply','paused'])
    .order('next_action_at')
    .limit(50)

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Fluxos ativos</h2>
          <p className="text-sm" style={{ color: '#8888a0' }}>{(flows || []).length} fluxos em execucao</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        {(flows || []).length === 0 ? (
          <p className="text-sm py-12 text-center" style={{ color: '#5a5a72' }}>Nenhum fluxo ativo. Os fluxos aparecem aqui quando o n8n cria recovery_flows.</p>
        ) : (
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
                {['Loja','Contato','Tipo','Status','Toque','Valor','Segmento','Prox. acao'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a5a72' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(flows || []).map((f: any, i: number) => (
                <tr key={i} className="transition-colors hover:bg-[#1a1a28]" style={{ borderBottom: '1px solid #2a2a3e22' }}>
                  <td className="py-3 px-4 font-medium" style={{ color: '#e8e8f0' }}>{f.tenants?.name || '—'}</td>
                  <td className="py-3 px-4">
                    <div style={{ color: '#e8e8f0' }}>{f.contacts?.name || 'Sem nome'}</div>
                    <div className="text-[11px]" style={{ color: '#5a5a72' }}>{f.contacts?.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: '#a855f718', color: '#a855f7' }}>
                      {flowLabels[f.flow_type] || f.flow_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: (statusColors[f.status] || '#888') + '18', color: statusColors[f.status] || '#888' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[f.status] }} />
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {Array.from({ length: f.max_touches }, (_, t) => (
                        <div key={t} className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" style={{ background: t < f.current_touch ? '#22c55e' : '#222236', border: `1px solid ${t < f.current_touch ? '#22c55e' : '#2a2a3e'}`, color: t < f.current_touch ? '#000' : '#5a5a72' }}>
                          {t + 1}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold" style={{ color: '#e8e8f0' }}>
                    {f.cart_value ? `R$ ${parseFloat(f.cart_value).toLocaleString('pt-BR')}` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {f.value_segment && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: f.value_segment === 'high' ? '#f59e0b18' : f.value_segment === 'medium' ? '#3b82f618' : '#2a2a3e', color: f.value_segment === 'high' ? '#f59e0b' : f.value_segment === 'medium' ? '#3b82f6' : '#8888a0' }}>
                        {f.value_segment}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium" style={{ color: '#22c55e' }}>
                    {f.next_action_at ? new Date(f.next_action_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
