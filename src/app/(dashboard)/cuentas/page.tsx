import { Plus, Wallet, CreditCard, PiggyBank } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const cuentas = [
  { id: 1, name: 'Banco Santander', type: 'Corriente', balance: 12450.00, icon: Wallet, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 2, name: 'Cuenta Ahorro', type: 'Ahorro', balance: 32500.00, icon: PiggyBank, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 3, name: 'Tarjeta N26', type: 'Crédito', balance: -450.50, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
]

export default function CuentasPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Cuentas</h2>
          <p className="text-muted-foreground mt-1">Administra tus saldos y carteras.</p>
        </div>
        <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cuentas.map((cuenta) => (
          <Card key={cuenta.id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] transition-all rounded-2xl cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${cuenta.bg} flex items-center justify-center ${cuenta.color} group-hover:scale-110 transition-transform`}>
                  <cuenta.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{cuenta.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{cuenta.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mt-4 ${cuenta.balance < 0 ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cuenta.balance)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
