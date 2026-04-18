'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

const NAV = [
  { section: 'Principal', items: [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'flows', label: 'Fluxos ativos', path: '/flows' },
  ]},
  { section: 'Configuracao', items: [
    { id: 'tenants', label: 'Lojas', path: '/tenants' },
    { id: 'agents', label: 'Agentes IA', path: '/agents' },
    { id: 'prompts', label: 'Prompts', path: '/prompts' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(true)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div
      className="flex flex-col shrink-0 transition-all duration-200 overflow-hidden"
      style={{
        width: open ? 220 : 60,
        background: '#12121c',
        borderRight: '1px solid #2a2a3e',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid #2a2a3e' }}>
        {open && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: '#22c55e', color: '#000' }}>W</div>
            <span className="text-sm font-bold" style={{ color: '#e8e8f0' }}>WA Commerce</span>
          </div>
        )}
        <button onClick={() => setOpen(!open)} className="text-sm p-1" style={{ color: '#8888a0', background: 'none', border: 'none', cursor: 'pointer' }}>
          {open ? '←' : '→'}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV.map((section, si) => (
          <div key={si} className="mb-4">
            {open && (
              <div className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1" style={{ color: '#5a5a72' }}>
                {section.section}
              </div>
            )}
            {section.items.map(item => {
              const isActive = pathname === item.path || pathname?.startsWith(item.path + '/')
              return (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-2.5 w-full rounded-lg text-[13px] transition-all mb-0.5"
                  style={{
                    padding: open ? '8px 12px' : '8px 0',
                    justifyContent: open ? 'flex-start' : 'center',
                    background: isActive ? '#22c55e15' : 'transparent',
                    color: isActive ? '#22c55e' : '#8888a0',
                    fontWeight: isActive ? 600 : 400,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {open && <span>{item.label}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid #2a2a3e' }}>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs py-2 px-3 rounded-lg transition-colors"
          style={{ color: '#8888a0', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {open ? 'Sair' : '×'}
        </button>
      </div>
    </div>
  )
}
