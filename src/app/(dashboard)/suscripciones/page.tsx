import { CalendarDays, CreditCard, Receipt, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionDialog } from '@/components/forms/subscription-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function SuscripcionesPage() {
  const workspace = await getCurrentWorkspace()
  
  const suscripciones = await prisma.subscription.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { nextBilling: 'asc' }
  })

  // Calculate totals
  const totalMensual = suscripciones.reduce((sum, sub) => {
    return sum + (sub.frequency === 'MONTHLY' ? sub.price : sub.price / 12)
  }, 0)
  
  const totalAnual = suscripciones.reduce((sum, sub) => {
    return sum + (sub.frequency === 'YEARLY' ? sub.price : sub.price * 12)
  }, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suscripciones</h2>
          <p className="text-muted-foreground mt-1">Controla tus pagos recurrentes.</p>
        </div>
        <SubscriptionDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Gasto Mensual Estimado</p>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">€{totalMensual.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <CalendarDays className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Gasto Anual Estimado</p>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">€{totalAnual.toFixed(2)}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {suscripciones.length === 0 ? (
        <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <Receipt className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay suscripciones</h3>
          <p className="text-zinc-500 mt-2">Añade Netflix, tu gimnasio o cualquier pago recurrente para controlarlo.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suscripciones.map((sub) => {
            const daysUntil = Math.ceil((new Date(sub.nextBilling).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
            const isSoon = daysUntil <= 7 && daysUntil >= 0
            const isPast = daysUntil < 0
            
            return (
              <Card key={sub.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{sub.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{sub.frequency === 'MONTHLY' ? 'Mensual' : 'Anual'}</p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SubscriptionDialog subscription={sub} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2 mb-4">
                    €{sub.price.toFixed(2)}
                  </div>
                  
                  <div className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg ${
                    isPast ? 'bg-red-50 text-red-600 dark:bg-red-950/50' :
                    isSoon ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50' : 
                    'bg-zinc-50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400'
                  }`}>
                    <Clock className="w-4 h-4 mr-2" />
                    {isPast ? 'Cobro atrasado' :
                     daysUntil === 0 ? 'Se cobra hoy' :
                     daysUntil === 1 ? 'Se cobra mañana' :
                     `Próximo cobro en ${daysUntil} días`}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
