import { createAdminClient } from '@/lib/supabase-server'
import CreateTenantModal from './CreateTenantModal'
import LinkWhatsAppModal from './LinkWhatsAppModal'

export default async function TenantsPage() {
  const supabase = createAdminClient()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*, whatsapp_accounts(phone_number, quality_rating, is_active)')
    .is('deleted_at', null)
    .order('name')

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#e8e8f0' }}>Lojas</h2>
          <p className="text-sm" style={{ color: '#8888a0' }}>{(tenants || []).length} lojas cadastradas</p>
        </div>
        <CreateTenantModal />
      </div>

      <div className="grid gap-3.5">
        {(tenants || []).map((t: any, i: number) => (
          <div key={i} className="rounded-xl p-5 animate-fade-up" style={{ background: '#12121c', border: '1px solid #2a2a3e', animationDelay: `${i * 60}ms` }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold" style={{ color: '#e8e8f0' }}>{t.name}</h3>
                  <code className="px-1.5 py-0.5 rounded text-[10px] font-mono cursor-text select-all" style={{ background: '#2a2a3e', color: '#8888a0' }}>{t.id}</code>
                </div>
                <p className="text-xs mt-1" style={{ color: '#5a5a72' }}>{t.shopify_domain}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: t.status === 'active' ? '#22c55e18' : '#f59e0b18', color: t.status === 'active' ? '#22c55e' : '#f59e0b' }}>{t.status}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={{ background: '#3b82f618', color: '#3b82f6' }}>{t.plan}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Timezone', value: t.timezone?.replace('America/', '') },
              ].map((f, j) => (
                <div key={j} className="rounded-lg p-3" style={{ background: '#0c0c14', border: '1px solid #2a2a3e44' }}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#5a5a72' }}>{f.label}</div>
                  <div className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{f.value}</div>
                </div>
              ))}
            </div>

            {t.whatsapp_accounts && t.whatsapp_accounts.length > 0 && (
              <div className="flex gap-2">
                {t.whatsapp_accounts.map((wa: any, k: number) => (
                  <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs" style={{ background: '#0c0c14', border: '1px solid #2a2a3e' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: wa.quality_rating === 'GREEN' ? '#22c55e' : wa.quality_rating === 'YELLOW' ? '#f59e0b' : '#ef4444' }} />
                    <span style={{ color: '#8888a0' }}>{wa.phone_number}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
