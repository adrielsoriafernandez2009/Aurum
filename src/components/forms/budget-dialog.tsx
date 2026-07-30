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
import { createBudget } from '@/app/(dashboard)/actions'

export function BudgetDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)

  async function action(formData: FormData) {
    await createBudget(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-expect-error React 19 asChild type mismatch */}
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Presupuesto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
        <DialogHeader>
          <DialogTitle>Añadir Presupuesto</DialogTitle>
          <DialogDescription>
            Fija un límite de gasto mensual para una categoría.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <select id="categoryId" name="categoryId" required className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {categories.filter(c => c.type === 'EXPENSE').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Límite Mensual (€)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" required placeholder="500.00" className="rounded-xl" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              Guardar Presupuesto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
