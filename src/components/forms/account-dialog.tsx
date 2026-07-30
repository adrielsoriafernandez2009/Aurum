'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { createAccount } from '@/app/(dashboard)/actions'

export function AccountDialog() {
  const [open, setOpen] = useState(false)

  async function action(formData: FormData) {
    await createAccount(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error React 19 asChild type mismatch */}
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cuenta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Cuenta</DialogTitle>
          <DialogDescription>
            Crea una nueva cuenta bancaria, tarjeta o cartera para organizar tus fondos.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la cuenta</Label>
            <Input id="name" name="name" required placeholder="Ej: Banco Santander" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select id="type" name="type" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="BANK">Cuenta Bancaria</option>
                <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                <option value="CASH">Efectivo</option>
                <option value="SAVINGS">Ahorro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Saldo Inicial (€)</Label>
              <Input id="balance" name="balance" type="number" step="0.01" required defaultValue="0" className="rounded-xl" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              Guardar Cuenta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
