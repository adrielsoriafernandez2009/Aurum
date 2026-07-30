import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownIcon, ArrowUpIcon, Wallet, PiggyBank, Target, CalendarClock, TrendingUp } from 'lucide-react'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const workspace = await getCurrentWorkspace()

  const accounts = await prisma.account.findMany({ where: { workspaceId: workspace.id } })
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Get goals
  const objetivos = await prisma.goal.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  const transactions = await prisma.transaction.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { date: 'desc' },
    take: 5,
    include: { category: true }
  })

  const monthlyTransactions = await prisma.transaction.findMany({
    where: { workspaceId: workspace.id, date: { gte: startOfMonth } }
  })

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  let incomeMonth = 0
  let expenseMonth = 0
  
  monthlyTransactions.forEach(t => {
    if (t.type === 'INCOME') incomeMonth += t.amount
    if (t.type === 'EXPENSE') expenseMonth += t.amount
  })

  const savingsMonth = incomeMonth - expenseMonth
  const savingsRate = incomeMonth > 0 ? (savingsMonth / incomeMonth) * 100 : 0

  const cashBalance = accounts.filter(acc => acc.type === 'CASH').reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Resumen Financiero</h2>
        <p className="text-muted-foreground mt-1">Aquí tienes el estado de tus finanzas este mes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Patrimonio */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimonio Total</CardTitle>
            <Wallet className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalBalance)}
            </div>
          </CardContent>
        </Card>
        
        {/* Efectivo */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectivo Disponible</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cashBalance)}
            </div>
          </CardContent>
        </Card>

        {/* Ingresos */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(incomeMonth)}
            </div>
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos (Mes)</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(expenseMonth)}
            </div>
          </CardContent>
        </Card>

        {/* Ahorro */}
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorro (Mes)</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(savingsMonth)}
            </div>
            <div className="mt-3 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} />
            </div>
            <p className="text-xs text-zinc-500 mt-2">{savingsRate.toFixed(1)}% de ingresos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Últimos Movimientos */}
        <Link href="/movimientos" className="lg:col-span-4 h-full">
          <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Últimos Movimientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-sm">Aún no hay movimientos registrados.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="flex items-center group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 text-lg shadow-sm group-hover:scale-105 transition-transform">
                        {t.category ? (t.category.name.charAt(0)) : '📄'}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{t.date.toLocaleDateString()}</p>
                      </div>
                      <div className={`ml-auto font-medium ${t.type === 'INCOME' ? 'text-emerald-500' : t.type === 'TRANSFER' ? 'text-blue-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {t.type === 'EXPENSE' ? '-' : '+'}{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(t.amount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Objetivos */}
        <div className="lg:col-span-3 space-y-6 h-full">
          <Link href="/objetivos" className="block h-full">
            <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle>Objetivos de Ahorro</CardTitle>
                <Target className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                {objetivos.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-sm">Sin objetivos activos.</div>
                ) : (
                  <div className="space-y-4">
                    {objetivos.map(obj => {
                      const percent = obj.targetAmount > 0 ? (obj.savedAmount / obj.targetAmount) * 100 : 0
                      return (
                        <div key={obj.id} className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{obj.name}</span>
                            <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(obj.savedAmount)} / {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(obj.targetAmount)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
