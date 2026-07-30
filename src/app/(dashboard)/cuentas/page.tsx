import { Wallet, CreditCard, PiggyBank, Coins } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountDialog } from '@/components/forms/account-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'PiggyBank': return PiggyBank;
    case 'CreditCard': return CreditCard;
    case 'Coins': return Coins;
    default: return Wallet;
  }
}

export default async function CuentasPage() {
  const workspace = await getCurrentWorkspace()
  
  const cuentas = await prisma.account.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Cuentas</h2>
          <p className="text-muted-foreground mt-1">Administra tus saldos y carteras.</p>
        </div>
        <AccountDialog />
      </div>

      {cuentas.length === 0 ? (
        <div className="text-center p-12 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
          <Wallet className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay cuentas</h3>
          <p className="text-zinc-500 mt-2">Añade tu primera cuenta para empezar a gestionar tus finanzas.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cuentas.map((cuenta) => {
            const IconComponent = getIconComponent(cuenta.icon || 'Wallet')
            const bgClass = cuenta.balance < 0 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'

            return (
              <Card key={cuenta.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${bgClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{cuenta.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{cuenta.type}</p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <AccountDialog account={cuenta} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold mt-4 ${cuenta.balance < 0 ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: cuenta.currency }).format(cuenta.balance)}
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
