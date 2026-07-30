import { CreditCard, FileText } from 'lucide-react'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SuscripcionesPage() {
  const workspace = await getCurrentWorkspace()
  
  const subscriptions = await prisma.subscription.findMany({
    where: { workspaceId: workspace.id }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Suscripciones</h2>
        <p className="text-muted-foreground mt-1">Gestiona tus pagos recurrentes de suscripciones.</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <CreditCard className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay suscripciones</h3>
          <p className="text-zinc-500 mt-2">Próximamente podrás añadir y gestionar tus suscripciones aquí.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map(sub => (
            <div key={sub.id}>{sub.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}
