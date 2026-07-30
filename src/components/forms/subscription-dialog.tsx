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
import { createSubscription, updateSubscription, deleteSubscription } from '@/app/(dashboard)/actions'

export function SubscriptionDialog({ subscription }: { subscription?: any }) {
  const [open, setOpen] = useState(false)
  const isEdit = !!subscription

  async function action(formData: FormData) {
    if (isEdit) {
      await updateSubscription(subscription.id, formData)
    } else {
      await createSubscription(formData)
    }
    setOpen(false)
  }

  async function handleDelete() {
    if (window.confirm('¿Seguro que deseas eliminar esta suscripción?')) {
      await deleteSubscription(subscription.id)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isEdit ? (
          <DialogTrigger {...({ asChild: true } as any)}>
            <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Suscripción
            </Button>
          </DialogTrigger>
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
            <DialogTitle>{isEdit ? 'Editar Suscripción' : 'Añadir Nueva Suscripción'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modifica los detalles de tu suscripción.' : 'Registra tus pagos recurrentes (Netflix, Gimnasio, etc).'}
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Servicio</Label>
              <Input id="name" name="name" required defaultValue={subscription?.name} placeholder="Ej: Netflix" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <select id="frequency" name="frequency" defaultValue={subscription?.frequency || "MONTHLY"} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="MONTHLY">Mensual</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio (€)</Label>
                <Input id="price" name="price" type="number" step="0.01" required defaultValue={subscription?.price} placeholder="0.00" className="rounded-xl" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextBilling">Próximo Cobro</Label>
              <Input id="nextBilling" name="nextBilling" type="date" required defaultValue={subscription?.nextBilling ? new Date(subscription.nextBilling).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="rounded-xl" />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
                {isEdit ? 'Guardar Cambios' : 'Añadir Suscripción'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
