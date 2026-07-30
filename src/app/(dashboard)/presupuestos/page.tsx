import { Settings2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetDialog } from '@/components/forms/budget-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PresupuestosPage() {
  const workspace = await getCurrentWorkspace()

  // Get budgets with their category
  const budgets = await prisma.budget.findMany({
    where: { workspaceId: workspace.id },
    include: { category: true }
  })

  // Get transactions for the current month to calculate spent amount
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const monthlyTransactions = await prisma.transaction.findMany({
    where: { 
      workspaceId: workspace.id,
      date: { gte: startOfMonth },
      type: 'EXPENSE'
    }
  })

  const categories = await prisma.category.findMany({ where: { workspaceId: workspace.id } })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Presupuestos</h2>
          <p className="text-muted-foreground mt-1">Controla tus gastos y evita excesos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all">
            <Settings2 className="mr-2 h-4 w-4" />
            Configurar Global
          </Button>
          <BudgetDialog categories={JSON.parse(JSON.stringify(categories))} />
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <FileText className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay presupuestos</h3>
          <p className="text-zinc-500 mt-2">Crea tu primer presupuesto para empezar a controlar tus gastos.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {budgets.map((pres) => {
            const spent = monthlyTransactions
              .filter(t => t.categoryId === pres.categoryId)
              .reduce((sum, t) => sum + t.amount, 0)
            
            const percentage = pres.amount > 0 ? (spent / pres.amount) * 100 : 0
            const isDanger = percentage >= 90
            const colorClass = isDanger ? 'bg-rose-500' : 'bg-indigo-500'
            const name = pres.category ? pres.category.name : 'Presupuesto General'
            
            return (
              <Card key={pres.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <BudgetDialog budget={JSON.parse(JSON.stringify(pres))} categories={JSON.parse(JSON.stringify(categories))} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">€{spent.toFixed(2)}</span>
                      <span className="text-muted-foreground"> / €{pres.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm font-medium text-zinc-500">
                      Quedan €{Math.max(0, pres.amount - spent).toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${colorClass} transition-all duration-1000`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>
                  {isDanger && (
                    <p className="text-xs text-rose-500 mt-3 font-medium flex items-center">
                      ⚠️ Te estás acercando al límite de este presupuesto
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
