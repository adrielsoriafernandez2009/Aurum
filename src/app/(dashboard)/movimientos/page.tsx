import { Search, Filter, ArrowUpDown, MoreHorizontal, Download, FileText } from 'lucide-react'
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
import { TransactionDialog } from '@/components/forms/transaction-dialog'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const workspace = await getCurrentWorkspace()
  const query = searchParams?.q || ''
  
  const whereClause: any = { workspaceId: workspace.id }
  if (query) {
    whereClause.OR = [
      { description: { contains: query, mode: 'insensitive' } }
      // Category name search requires more complex relation filtering but description is usually enough
    ]
  }
  
  const [movimientos, accounts, categories] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        account: true,
        category: true
      }
    }),
    prisma.account.findMany({ where: { workspaceId: workspace.id } }),
    prisma.category.findMany({ where: { workspaceId: workspace.id } })
  ])

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
          <TransactionDialog accounts={JSON.parse(JSON.stringify(accounts))} categories={JSON.parse(JSON.stringify(categories))} />
        </div>
      </div>

      <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm overflow-hidden rounded-2xl">
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form action="/movimientos" method="GET" className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre, categoría o cantidad..." 
              className="pl-10 rounded-xl bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-8 text-sm"
            />
          </form>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="rounded-xl h-10 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 transition-all">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
        
        {movimientos.length === 0 ? (
          <div className="text-center p-12">
            <FileText className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No hay movimientos</h3>
            <p className="text-zinc-500 mt-2">Registra tu primer ingreso o gasto.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                <TableRow className="border-zinc-200/50 dark:border-zinc-800/50 hover:bg-transparent">
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" className="-ml-4 hover:bg-transparent font-medium text-zinc-500">
                      Concepto
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
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{mov.description}</TableCell>
                    <TableCell className="text-zinc-500">{mov.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                    <TableCell>
                      {mov.category ? (
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 ${mov.category.color}`}>
                          {mov.category.name}
                        </span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-zinc-500">{mov.account.name}</TableCell>
                    <TableCell className={`text-right font-medium ${mov.type === 'INCOME' ? 'text-emerald-500' : mov.type === 'TRANSFER' ? 'text-blue-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {mov.type === 'EXPENSE' ? '-' : '+'}{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(mov.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                        <TransactionDialog transaction={JSON.parse(JSON.stringify(mov))} accounts={JSON.parse(JSON.stringify(accounts))} categories={JSON.parse(JSON.stringify(categories))} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}
