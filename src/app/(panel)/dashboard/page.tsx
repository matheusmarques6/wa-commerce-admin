import { createAdminClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = createAdminClient()

  const [
    { data: tenants },
    { data: activeFlows },
    { data: todayMetrics },
  ] = await Promise.all([
    supabase.from('tenants').select('*').eq('status', 'active').is('deleted_at', null).order('name'),
    supabase.from('recovery_flows').select('*, contacts(name, phone)').in('status', ['pending','active','waiting_reply','paused']).order('next_action_at').limit(20),
    supabase.from('daily_metrics').select('*').eq('metric_date', new Date().toISOString().split('T')[0]),
  ])

  const totals = (todayMetrics || []).reduce((acc, m) => ({
    flows: acc.flows + (m.flows_started || 0),
    converted: acc.converted + (m.flows_converted || 0),
    revenue: acc.revenue + parseFloat(m.revenue_recovered || '0'),
    cost: acc.cost + parseFloat(m.cost_total || '0'),
  }), { flows: 0, converted: 0, revenue: 0, cost: 0 })

  const roas = totals.cost > 0 ? (totals.revenue / totals.cost).toFixed(1) : '0'

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Dashboard</h2>
        <p className="text-sm" style={{ color: '#8888a0' }}>Visao geral — {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {[
          { label: 'Fluxos ativos', value: (activeFlows || []).length },
          { label: 'Convertidos hoje', value: totals.converted },
          { label: 'Receita recuperada', value: `R$ ${totals.revenue.toLocaleString('pt-BR')}` },
          { label: 'ROAS', value: `${roas}x` },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl p-5 animate-fade-up" style={{ background: '#12121c', border: '1px solid #2a2a3e', animationDelay: `${i * 80}ms` }}>
            <div className="text-xs font-medium mb-1.5" style={{ color: '#8888a0' }}>{kpi.label}</div>
            <div className="text-2xl font-bold" style={{ color: '#e8e8f0' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5 mb-6" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Lojas ativas ({(tenants || []).length})</h3>
        {(tenants || []).length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: '#5a5a72' }}>Nenhuma loja cadastrada ainda.</p>
        ) : (
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
                {['Loja','Dominio','Plano','Status'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a5a72' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tenants || []).map((t: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #2a2a3e22' }}>
                  <td className="py-3 px-3 font-semibold" style={{ color: '#e8e8f0' }}>{t.name}</td>
                  <td className="py-3 px-3 text-xs" style={{ color: '#8888a0' }}>{t.shopify_domain}</td>
                  <td className="py-3 px-3 capitalize" style={{ color: '#8888a0' }}>{t.plan}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: '#22c55e18', color: '#22c55e' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl p-5" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0' }}>Fluxos ativos ({(activeFlows || []).length})</h3>
        {(activeFlows || []).length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: '#5a5a72' }}>Nenhum fluxo ativo no momento.</p>
        ) : (
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
                {['Contato','Tipo','Status','Toque','Valor','Prox. acao'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a5a72' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activeFlows || []).map((f: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #2a2a3e22' }}>
                  <td className="py-3 px-3" style={{ color: '#e8e8f0' }}>{f.contacts?.name || 'Sem nome'}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: '#a855f718', color: '#a855f7' }}>{f.flow_type?.replace(/_/g, ' ')}</span></td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: f.status === 'active' ? '#22c55e18' : '#f59e0b18', color: f.status === 'active' ? '#22c55e' : '#f59e0b' }}>{f.status}</span></td>
                  <td className="py-3 px-3" style={{ color: '#e8e8f0' }}>{f.current_touch}/{f.max_touches}</td>
                  <td className="py-3 px-3 font-semibold" style={{ color: '#e8e8f0' }}>{f.cart_value ? `R$ ${parseFloat(f.cart_value).toLocaleString('pt-BR')}` : '—'}</td>
                  <td className="py-3 px-3 text-xs" style={{ color: '#22c55e' }}>{f.next_action_at ? new Date(f.next_action_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
