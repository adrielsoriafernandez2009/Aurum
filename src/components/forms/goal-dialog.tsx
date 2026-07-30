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
import { createGoal, updateGoal, deleteGoal } from '@/app/(dashboard)/actions'

export function GoalDialog({ goal }: { goal?: any }) {
  const [open, setOpen] = useState(false)
  const isEdit = !!goal

  async function action(formData: FormData) {
    if (isEdit) {
      await updateGoal(goal.id, formData)
    } else {
      await createGoal(formData)
    }
    setOpen(false)
  }

  async function handleDelete() {
    if (window.confirm('¿Seguro que deseas eliminar este objetivo?')) {
      await deleteGoal(goal.id)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isEdit ? (
          <DialogTrigger {...({ asChild: true } as any)}>
            <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Objetivo
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
            <DialogTitle>{isEdit ? 'Editar Objetivo' : 'Añadir Nuevo Objetivo'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modifica los detalles de tu hucha.' : 'Crea una meta de ahorro para tus futuros planes.'}
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del objetivo</Label>
              <Input id="name" name="name" required defaultValue={goal?.name} placeholder="Ej: Viaje a Japón" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Meta (€)</Label>
                <Input id="targetAmount" name="targetAmount" type="number" step="0.01" required defaultValue={goal?.targetAmount} placeholder="Ej: 2000" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="savedAmount">Ya ahorrado (€)</Label>
                <Input id="savedAmount" name="savedAmount" type="number" step="0.01" required defaultValue={goal?.savedAmount ?? "0"} className="rounded-xl" />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
                {isEdit ? 'Guardar Cambios' : 'Guardar Objetivo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
