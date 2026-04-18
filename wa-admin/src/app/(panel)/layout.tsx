import Sidebar from '@/components/Sidebar'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-7">
        {children}
      </main>
    </div>
  )
}
