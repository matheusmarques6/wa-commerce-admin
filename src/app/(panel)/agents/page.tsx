import { createAdminClient } from '@/lib/supabase-server'

export default async function AgentsPage() {
  const supabase = createAdminClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('*, tenants(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Agentes IA</h2>
        <p className="text-sm" style={{ color: '#8888a0' }}>Briefing, tom de voz e conhecimento por loja</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {(agents || []).map((a: any, i: number) => (
          <div key={i} className="rounded-xl p-5 animate-fade-up" style={{ background: '#12121c', border: '1px solid #2a2a3e', animationDelay: `${i * 60}ms` }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>{a.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: '#5a5a72' }}>{a.tenants?.name}</p>
              </div>
              <div className="flex gap-1.5">
                {a.is_default && <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#22c55e18', color: '#22c55e' }}>default</span>}
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#a855f718', color: '#a855f7' }}>{a.type}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: '#2a2a3e', color: '#8888a0' }}>v{a.config_version}</span>
              </div>
            </div>

            <div className="rounded-lg p-3 mb-3" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
              <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: '#5a5a72' }}>Briefing</div>
              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#8888a0' }}>{a.briefing}</p>
            </div>

            <div className="rounded-lg p-3" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
              <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: '#5a5a72' }}>Tom de voz</div>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#8888a0' }}>{a.tone_of_voice}</p>
            </div>
          </div>
        ))}

        {(agents || []).length === 0 && (
          <p className="text-sm py-8 text-center col-span-2" style={{ color: '#5a5a72' }}>Nenhum agente cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
