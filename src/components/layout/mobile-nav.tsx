'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  WalletCards,
  BarChart3,
  Building2,
  Menu,
  PieChart,
  Target,
  CreditCard,
  Settings,
  Scan
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScannerButton } from '@/components/forms/scanner-button'
import { TransactionDialog } from '@/components/forms/transaction-dialog'
import { ScannedData } from '@/lib/scanner'

export function MobileNav({ accounts = [], categories = [] }: { accounts?: any[], categories?: any[] }) {
  const pathname = usePathname()
  const [scanData, setScanData] = useState<ScannedData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const mainLinks = [
    { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Movimientos', href: '/movimientos', icon: WalletCards },
    { name: 'Cuentas', href: '/cuentas', icon: Building2 },
  ]
  
  const moreLinks = [
    { name: 'Estadísticas', href: '/estadisticas', icon: BarChart3 },
    { name: 'Presupuestos', href: '/presupuestos', icon: PieChart },
    { name: 'Objetivos', href: '/objetivos', icon: Target },
    { name: 'Suscripciones', href: '/suscripciones', icon: CreditCard },
    { name: 'Configuración', href: '/configuracion', icon: Settings },
  ]

  const handleScanComplete = (data: ScannedData) => {
    setScanData(data)
    setDialogOpen(true)
  }

  return (
    <>
      {/* Invisible dialog that opens when scan completes */}
      <TransactionDialog 
        accounts={accounts} 
        categories={categories} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        prefillData={{
          amount: scanData?.amount,
          description: scanData?.merchant,
          date: scanData?.date
        }}
        trigger={<div className="hidden" />}
      />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_-4px_30px_rgb(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16 px-1 relative">
        {mainLinks.slice(0, 2).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'text-zinc-900 dark:text-white' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
            </Link>
          )
        })}

        <div className="w-12 h-12 relative flex items-center justify-center mx-2">
          <ScannerButton mobile onScanComplete={handleScanComplete} />
        </div>
        
        {mainLinks.slice(2).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'text-zinc-900 dark:text-white' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-tight">{item.name}</span>
            </Link>
          )
        })}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 outline-none transition-colors">
            <Menu className="h-6 w-6" strokeWidth={2} />
            <span className="text-[10px] font-medium tracking-tight">Más</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48 mb-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl p-1">
            {moreLinks.map(item => (
              <DropdownMenuItem key={item.name} className="rounded-xl cursor-pointer p-0">
                <Link href={item.href} className="flex items-center w-full font-medium h-10 px-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    </>
  )
}
