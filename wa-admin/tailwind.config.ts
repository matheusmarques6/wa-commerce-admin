import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0c0c14', 2: '#12121c', 3: '#1a1a28', 4: '#222236' },
        border: { DEFAULT: '#2a2a3e', light: '#353550' },
        txt: { DEFAULT: '#e8e8f0', muted: '#8888a0', dim: '#5a5a72' },
        accent: { DEFAULT: '#22c55e', dim: '#16a34a' },
        warn: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
