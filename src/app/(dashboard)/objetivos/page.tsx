import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const objetivos = [
  { id: 1, name: 'Fondo de Emergencia', target: 10000, current: 5000, color: 'bg-indigo-500' },
  { id: 2, name: 'Viaje a Japón', target: 3000, current: 2100, color: 'bg-rose-500' },
  { id: 3, name: 'Entrada Coche', target: 5000, current: 1500, color: 'bg-emerald-500' },
]

export default function ObjetivosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Objetivos de Ahorro</h2>
          <p className="text-muted-foreground mt-1">Planifica y alcanza tus metas financieras.</p>
        </div>
        <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Objetivo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {objetivos.map((obj) => (
          <Card key={obj.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl group cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{obj.name}</CardTitle>
              <Target className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mt-2 mb-1">
                €{obj.current.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                de €{obj.target.toLocaleString()}
              </p>
              
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full ${obj.color} transition-all duration-1000`} style={{ width: `${(obj.current / obj.target) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs font-medium text-zinc-500">
                  <span>{Math.round((obj.current / obj.target) * 100)}% Completado</span>
                  <span>€{(obj.target - obj.current).toLocaleString()} restantes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
