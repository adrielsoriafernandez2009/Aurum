import { Search, Plus, Filter, ArrowUpDown, MoreHorizontal, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'

const movimientos = [
  { id: '1', name: 'Mercadona', date: '2026-07-27', category: 'Alimentación', account: 'Tarjeta N26', type: 'expense', amount: 84.30 },
  { id: '2', name: 'Nómina Empresa', date: '2026-07-26', category: 'Salario', account: 'Banco Santander', type: 'income', amount: 3100.00 },
  { id: '3', name: 'Netflix', date: '2026-07-12', category: 'Suscripciones', account: 'Tarjeta N26', type: 'expense', amount: 15.99 },
  { id: '4', name: 'Restaurante El Faro', date: '2026-07-10', category: 'Ocio', account: 'Tarjeta N26', type: 'expense', amount: 45.00 },
  { id: '5', name: 'Factura Luz', date: '2026-07-05', category: 'Vivienda', account: 'Banco Santander', type: 'expense', amount: 65.00 },
  { id: '6', name: 'Gimnasio', date: '2026-07-01', category: 'Salud', account: 'Tarjeta N26', type: 'expense', amount: 39.99 },
  { id: '7', name: 'Transferencia a Ahorro', date: '2026-06-28', category: 'Ahorro', account: 'Cuenta Ahorro', type: 'transfer', amount: 500.00 },
]

export default function MovimientosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Movimientos</h2>
          <p className="text-muted-foreground mt-1">Gestiona todos tus ingresos y gastos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all hover:bg-white dark:hover:bg-zinc-900">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Movimiento
          </Button>
        </div>
      </div>

      <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm overflow-hidden rounded-2xl">
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Buscar por nombre, categoría o cantidad..." 
              className="pl-10 rounded-xl bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="rounded-xl h-10 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-transparent">
                <TableHead className="w-[300px]">
                  <Button variant="ghost" className="-ml-4 hover:bg-transparent font-medium text-zinc-500">
                    Nombre
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-medium text-zinc-500">Fecha</TableHead>
                <TableHead className="font-medium text-zinc-500">Categoría</TableHead>
                <TableHead className="font-medium text-zinc-500">Cuenta</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="-mr-4 hover:bg-transparent font-medium justify-end w-full text-zinc-500">
                    Importe
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.map((mov) => (
                <TableRow key={mov.id} className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{mov.name}</TableCell>
                  <TableCell className="text-zinc-500">{new Date(mov.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                      {mov.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500">{mov.account}</TableCell>
                  <TableCell className={`text-right font-medium ${mov.type === 'income' ? 'text-emerald-500' : mov.type === 'transfer' ? 'text-blue-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {mov.type === 'expense' ? '-' : '+'}{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mov.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      {/* @ts-expect-error React 19 asChild type mismatch */}
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Editar</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Duplicar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
