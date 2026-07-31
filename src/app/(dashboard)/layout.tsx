import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { MobileNav } from '@/components/layout/mobile-nav'

import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const workspace = await getCurrentWorkspace()
  const [accounts, categories] = await Promise.all([
    prisma.account.findMany({ where: { workspaceId: workspace.id } }),
    prisma.category.findMany({ where: { workspaceId: workspace.id } })
  ])
  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <MobileNav accounts={JSON.parse(JSON.stringify(accounts))} categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  )
}
