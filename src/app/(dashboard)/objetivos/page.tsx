import { Target, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalDialog } from '@/components/forms/goal-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ObjetivosPage() {
  const workspace = await getCurrentWorkspace()
  
  const objetivos = await prisma.goal.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'desc' }
  })

  // Array of colors to cycle through
  const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500']

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Objetivos de Ahorro</h2>
          <p className="text-muted-foreground mt-1">Planifica y alcanza tus metas financieras.</p>
        </div>
        <GoalDialog />
      </div>

      {objetivos.length === 0 ? (
        <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <Target className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay objetivos</h3>
          <p className="text-zinc-500 mt-2">Crea tu primer objetivo para empezar a ahorrar.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {objetivos.map((obj, index) => {
            const color = colors[index % colors.length]
            const percentage = obj.targetAmount > 0 ? (obj.savedAmount / obj.targetAmount) * 100 : 0
            
            return (
              <Card key={obj.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{obj.name}</CardTitle>
                  <Target className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mt-2 mb-1">
                    €{obj.savedAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    de €{obj.targetAmount.toLocaleString()}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                      <span>{Math.round(percentage)}% Completado</span>
                      <span>€{Math.max(0, obj.targetAmount - obj.savedAmount).toLocaleString()} restantes</span>
                    </div>
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
