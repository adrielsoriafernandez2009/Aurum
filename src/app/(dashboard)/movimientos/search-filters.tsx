'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SearchAndFilters({ 
  accounts, 
  categories 
}: { 
  accounts: any[], 
  categories: any[] 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeType, setActiveType] = useState(searchParams.get('type') || '')
  const [activeAccount, setActiveAccount] = useState(searchParams.get('account') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      
      if (query) params.set('q', query)
      else params.delete('q')

      if (activeType) params.set('type', activeType)
      else params.delete('type')

      if (activeAccount) params.set('account', activeAccount)
      else params.delete('account')

      if (activeCategory) params.set('category', activeCategory)
      else params.delete('category')

      startTransition(() => {
        router.replace(`?${params.toString()}`)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [query, activeType, activeAccount, activeCategory, router, searchParams])

  const hasFilters = activeType || activeAccount || activeCategory

  const clearFilters = () => {
    setActiveType('')
    setActiveAccount('')
    setActiveCategory('')
  }

  return (
    <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o importe..." 
          className="pl-10 rounded-xl bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-10 text-sm"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Limpiar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant={hasFilters ? "default" : "outline"} size="sm" className={`rounded-xl h-10 transition-all ${hasFilters ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-white/50 dark:bg-zinc-900/50'}`} />
          }>
            <Filter className="mr-2 h-4 w-4" />
            Filtros {hasFilters ? '(Activos)' : ''}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-xl">
            
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tipo de Movimiento</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveType('')} className="cursor-pointer">
                Todos los tipos {activeType === '' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveType('EXPENSE')} className="cursor-pointer">
                Solo Gastos {activeType === 'EXPENSE' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveType('INCOME')} className="cursor-pointer">
                Solo Ingresos {activeType === 'INCOME' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveType('TRANSFER')} className="cursor-pointer">
                Transferencias {activeType === 'TRANSFER' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveAccount('')} className="cursor-pointer">
                Todas las cuentas {activeAccount === '' && '✓'}
              </DropdownMenuItem>
              {accounts.map(acc => (
                <DropdownMenuItem key={acc.id} onClick={() => setActiveAccount(acc.id)} className="cursor-pointer">
                  {acc.name} {activeAccount === acc.id && '✓'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel>Categoría</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveCategory('')} className="cursor-pointer">
                Todas las categorías {activeCategory === '' && '✓'}
              </DropdownMenuItem>
              {categories.map(cat => (
                <DropdownMenuItem key={cat.id} onClick={() => setActiveCategory(cat.id)} className="cursor-pointer">
                  {cat.name} {activeCategory === cat.id && '✓'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
