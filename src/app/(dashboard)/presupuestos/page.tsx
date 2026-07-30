import { Plus, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const presupuestos = [
  { id: 1, name: 'Alimentación', total: 500, spent: 340, alert: false },
  { id: 2, name: 'Ocio', total: 200, spent: 180, alert: true },
  { id: 3, name: 'Transporte', total: 150, spent: 65, alert: false },
  { id: 4, name: 'Vivienda', total: 1200, spent: 1200, alert: false },
]

export default function PresupuestosPage() {
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
          <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Presupuesto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {presupuestos.map((pres) => {
          const percentage = (pres.spent / pres.total) * 100
          const isDanger = percentage >= 90
          const colorClass = isDanger ? 'bg-rose-500' : 'bg-indigo-500'
          
          return (
            <Card key={pres.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{pres.name}</CardTitle>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDanger ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {percentage.toFixed(0)}%
                </span>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold">€{pres.spent}</span>
                    <span className="text-muted-foreground"> / €{pres.total}</span>
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    Quedan €{pres.total - pres.spent}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${colorClass} transition-all duration-1000`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                </div>
                {pres.alert && (
                  <p className="text-xs text-rose-500 mt-3 font-medium flex items-center">
                    ⚠️ Te estás acercando al límite de este presupuesto
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
