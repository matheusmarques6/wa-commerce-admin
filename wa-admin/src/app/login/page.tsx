'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0c0c14' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold" style={{ background: '#22c55e', color: '#000' }}>W</div>
          <h1 className="text-2xl font-bold" style={{ color: '#e8e8f0' }}>WA Commerce</h1>
          <p className="text-sm mt-1" style={{ color: '#8888a0' }}>Painel de administração</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl p-6" style={{ background: '#12121c', border: '1px solid #2a2a3e' }}>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2"
              style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0', '--tw-ring-color': '#22c55e' } as any}
              placeholder="bruno@convertfy.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#5a5a72' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2"
              style={{ background: '#0c0c14', border: '1px solid #2a2a3e', color: '#e8e8f0' } as any}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ background: '#ef444418', color: '#ef4444', border: '1px solid #ef444433' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity"
            style={{ background: '#22c55e', color: '#000', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
