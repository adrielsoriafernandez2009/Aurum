import { Target, FileText, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoalDialog } from '@/components/forms/goal-dialog'
import { AddFundsDialog } from '@/components/forms/add-funds-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ObjetivosPage() {
  try {
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
                <Card key={obj.id} className={`backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer ${percentage >= 100 ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/50' : 'bg-white/60 dark:bg-zinc-900/60'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {obj.name}
                      {percentage >= 100 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {percentage >= 100 ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 transition-colors" />
                      ) : (
                        <Target className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                      )}
                      <div>
                        <GoalDialog goal={JSON.parse(JSON.stringify(obj))} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold mt-2 mb-1 ${percentage >= 100 ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                      €{obj.savedAmount.toLocaleString()}
                    </div>
                    <p className={`text-sm mb-4 ${percentage >= 100 ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-muted-foreground'}`}>
                      de €{obj.targetAmount.toLocaleString()}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div className={`h-full ${percentage >= 100 ? 'bg-emerald-500' : color} transition-all duration-1000`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </div>
                      <div className={`flex justify-between text-xs font-medium ${percentage >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                        <span>{percentage >= 100 ? '¡Objetivo Completado!' : `${Math.round(percentage)}% Completado`}</span>
                        {! (percentage >= 100) && <span>€{Math.max(0, obj.targetAmount - obj.savedAmount).toLocaleString()} restantes</span>}
                      </div>
                    </div>
                    <AddFundsDialog goal={JSON.parse(JSON.stringify(obj))} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 font-mono text-sm shadow-xl">
        <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center"><Target className="mr-2" /> Error Interno de Vercel (Capturado)</h3>
        <p className="mb-4">Por favor, pásale este código de error exacto al asistente:</p>
        <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl overflow-x-auto whitespace-pre-wrap">
          <span className="font-bold">Message:</span> {error.message}
          <br/><br/>
          <span className="font-bold">Stack:</span><br/>
          {error.stack}
        </div>
      </div>
    )
  }
}
