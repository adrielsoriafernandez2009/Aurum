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
import { createAccount, updateAccount, deleteAccount } from '@/app/(dashboard)/actions'

export function AccountDialog({ account }: { account?: any }) {
  const [open, setOpen] = useState(false)
  
  const isEdit = !!account

  async function action(formData: FormData) {
    if (isEdit) {
      await updateAccount(account.id, formData)
    } else {
      await createAccount(formData)
    }
    setOpen(false)
  }

  async function handleDelete() {
    if (window.confirm('¿Seguro que deseas eliminar esta cuenta? Se perderán todos sus movimientos asociados.')) {
      await deleteAccount(account.id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit ? (
        <DialogTrigger {...({ asChild: true } as any)}>
          <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Button>
        </DialogTrigger>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger {...({ asChild: true } as any)}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
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
          <DialogTitle>{isEdit ? 'Editar Cuenta' : 'Añadir Nueva Cuenta'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los detalles de tu cuenta.' : 'Crea una nueva cuenta bancaria, tarjeta o cartera para organizar tus fondos.'}
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la cuenta</Label>
            <Input id="name" name="name" required defaultValue={account?.name} placeholder="Ej: Banco Santander" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select id="type" name="type" defaultValue={account?.type || "BANK"} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="BANK">Cuenta Bancaria</option>
                <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                <option value="CASH">Efectivo</option>
                <option value="SAVINGS">Ahorro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Saldo Actual (€)</Label>
              <Input id="balance" name="balance" type="number" step="0.01" required defaultValue={account?.balance ?? "0"} className="rounded-xl" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              {isEdit ? 'Actualizar Cuenta' : 'Guardar Cuenta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
