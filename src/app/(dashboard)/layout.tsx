import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
