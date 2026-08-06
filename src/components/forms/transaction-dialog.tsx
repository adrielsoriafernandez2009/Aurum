'use client'

import { useState } from 'react'
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createTransaction, updateTransaction, deleteTransaction } from '@/app/(dashboard)/actions'

export function TransactionDialog({ 
  transaction, 
  accounts, 
  categories,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  prefillData,
  trigger
}: { 
  transaction?: any, 
  accounts: any[], 
  categories: any[],
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
  prefillData?: { amount?: number | null, description?: string | null, date?: Date | null, categoryId?: string | null },
  trigger?: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = setControlledOpen || setInternalOpen
  
  const [type, setType] = useState<'INCOME'|'EXPENSE'|'TRANSFER'>(transaction?.type || 'EXPENSE')
  
  const isEdit = !!transaction

  async function action(formData: FormData) {
    if (isEdit) {
      await updateTransaction(transaction.id, formData)
    } else {
      await createTransaction(formData)
    }
    setOpen(false)
  }

  async function handleDelete() {
    if (window.confirm('¿Seguro que deseas eliminar este movimiento? Su impacto se deshará del saldo de la cuenta.')) {
      await deleteTransaction(transaction.id)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isEdit ? (
          trigger ? (
            <DialogTrigger {...({ asChild: true } as any)}>
              {trigger}
            </DialogTrigger>
          ) : (
            <DialogTrigger {...({ asChild: true } as any)}>
              <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
          )
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DialogTrigger {...({ asChild: true } as any)}>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Editar Movimiento' : 'Añadir Nuevo Movimiento'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modifica los detalles de este movimiento.' : 'Registra un nuevo ingreso o gasto en tus cuentas.'}
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value as 'INCOME'|'EXPENSE'|'TRANSFER')} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="EXPENSE">Gasto</option>
                  <option value="INCOME">Ingreso</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad (€)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" required defaultValue={transaction?.amount || prefillData?.amount || ""} placeholder="0.00" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" required defaultValue={transaction?.description || prefillData?.description || ""} placeholder="Ej: Compra supermercado" className="rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={type === 'TRANSFER' ? 'fromAccountId' : 'accountId'}>
                  {type === 'TRANSFER' ? 'Cuenta Origen' : 'Cuenta'}
                </Label>
                <select id={type === 'TRANSFER' ? 'fromAccountId' : 'accountId'} name={type === 'TRANSFER' ? 'fromAccountId' : 'accountId'} required defaultValue={type === 'TRANSFER' ? (transaction?.fromAccountId || "") : (transaction?.accountId || "")} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="" disabled>Selecciona cuenta</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              {type === 'TRANSFER' ? (
                <div className="space-y-2">
                  <Label htmlFor="toAccountId">Cuenta Destino</Label>
                  <select id="toAccountId" name="toAccountId" required defaultValue={transaction?.toAccountId || ""} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="" disabled>Selecciona cuenta</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoría</Label>
                  <select id="categoryId" name="categoryId" required defaultValue={transaction?.categoryId || prefillData?.categoryId || ""} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="" disabled>Selecciona categoría</option>
                    {categories.filter(c => c.type === type).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" required defaultValue={transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : (prefillData?.date ? new Date(prefillData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])} className="rounded-xl" />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
                {isEdit ? 'Guardar Cambios' : 'Añadir Movimiento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
