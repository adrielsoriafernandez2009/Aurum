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
import { updateGoal } from '@/app/(dashboard)/actions'

export function AddFundsDialog({ goal }: { goal: any }) {
  const [open, setOpen] = useState(false)

  async function action(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string || '0')
    const newSaved = goal.savedAmount + amount
    
    // Create a new formData with all the fields updateGoal expects
    const newFormData = new FormData()
    newFormData.append('name', goal.name)
    newFormData.append('targetAmount', goal.targetAmount.toString())
    newFormData.append('savedAmount', newSaved.toString())
    
    await updateGoal(goal.id, newFormData)
    setOpen(false)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger {...({ asChild: true } as any)}>
          <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Plus className="mr-2 h-4 w-4" />
            Añadir Fondos
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
          <DialogHeader>
            <DialogTitle>Añadir fondos a {goal.name}</DialogTitle>
            <DialogDescription>
              ¿Cuánto dinero quieres ingresar en esta meta de ahorro?
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Cantidad a ingresar (€)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required placeholder="Ej: 50" className="rounded-xl" />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all">
                Ingresar Fondos
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
