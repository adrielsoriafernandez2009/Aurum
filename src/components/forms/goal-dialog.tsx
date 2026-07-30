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
import { createGoal } from '@/app/(dashboard)/actions'

export function GoalDialog() {
  const [open, setOpen] = useState(false)

  async function action(formData: FormData) {
    await createGoal(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error React 19 asChild type mismatch */}
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Objetivo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
        <DialogHeader>
          <DialogTitle>Añadir Objetivo de Ahorro</DialogTitle>
          <DialogDescription>
            Define una meta para ahorrar dinero progresivamente.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del objetivo</Label>
            <Input id="name" name="name" required placeholder="Ej: Viaje a Japón" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Meta Total (€)</Label>
              <Input id="targetAmount" name="targetAmount" type="number" step="0.01" required placeholder="3000" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savedAmount">Ahorrado Inicial (€)</Label>
              <Input id="savedAmount" name="savedAmount" type="number" step="0.01" required defaultValue="0" className="rounded-xl" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              Guardar Objetivo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
