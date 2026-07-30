import Link from 'next/link'
import {
  LayoutDashboard,
  WalletCards,
  PieChart,
  Target,
  BarChart3,
  CalendarClock,
  CreditCard,
  Building2,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Movimientos', href: '/movimientos', icon: WalletCards },
  { name: 'Presupuestos', href: '/presupuestos', icon: PieChart },
  { name: 'Objetivos', href: '/objetivos', icon: Target },
  { name: 'Estadísticas', href: '/estadisticas', icon: BarChart3 },
  { name: 'Recurrentes', href: '/recurrentes', icon: CalendarClock },
  { name: 'Suscripciones', href: '/suscripciones', icon: CreditCard },
  { name: 'Cuentas', href: '/cuentas', icon: Building2 },
]

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl border-r border-zinc-200/50 dark:border-zinc-800/50">
      <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white dark:text-zinc-900 font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Aurum</span>
          </div>
        </div>
        <nav className="mt-10 flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all shadow-none hover:shadow-sm"
            >
              <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-4 pt-4">
          <Link
            href="/configuracion"
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            Configuración
          </Link>
        </div>
      </div>
    </div>
  )
}
