import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownIcon, ArrowUpIcon, Wallet, PiggyBank, Target, CalendarClock, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resumen Financiero</h2>
        <p className="text-muted-foreground mt-1">Aquí tienes el estado de tus finanzas este mes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Patrimonio */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimonio Total</CardTitle>
            <Wallet className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231.89</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              +2.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        
        {/* Ingresos */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€4,250.00</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              +5.4% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos (Mes)</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,840.50</div>
            <p className="text-xs text-rose-500 flex items-center mt-1">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              +1.2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        {/* Ahorro */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorro (Mes)</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€1,409.50</div>
            <div className="mt-3 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-blue-500 w-[33%] transition-all duration-1000" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">33% de los ingresos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Últimos Movimientos */}
        <Card className="lg:col-span-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
          <CardHeader>
            <CardTitle>Últimos Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Mercadona', date: 'Hoy, 10:45', amount: '-€84.30', icon: '🛒' },
                { name: 'Nómina Empresa', date: 'Ayer', amount: '+€3,100.00', icon: '💼', type: 'income' },
                { name: 'Netflix', date: '12 May', amount: '-€15.99', icon: '🎬' },
                { name: 'Restaurante El Faro', date: '10 May', amount: '-€45.00', icon: '🍽️' },
              ].map((item, i) => (
                <div key={i} className="flex items-center group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-lg shadow-sm group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className={`ml-auto font-medium ${item.type === 'income' ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Objetivos y Recurrentes */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Objetivos de Ahorro</CardTitle>
              <Target className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 group cursor-pointer">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Fondo de Emergencia</span>
                  <span className="text-muted-foreground">€5,000 / €10,000</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[50%] group-hover:bg-indigo-400 transition-all duration-300" />
                </div>
              </div>
              <div className="space-y-2 group cursor-pointer">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Viaje a Japón</span>
                  <span className="text-muted-foreground">€2,100 / €3,000</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-rose-500 w-[70%] group-hover:bg-rose-400 transition-all duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Próximos Recurrentes</CardTitle>
              <CalendarClock className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                      ⚡
                    </div>
                    <div>
                      <p className="text-sm font-medium">Factura Luz</p>
                      <p className="text-xs text-muted-foreground">Mañana</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">-€65.00</span>
                </div>
                <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                      💧
                    </div>
                    <div>
                      <p className="text-sm font-medium">Factura Agua</p>
                      <p className="text-xs text-muted-foreground">En 3 días</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">-€24.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
