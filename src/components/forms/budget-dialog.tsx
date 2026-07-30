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
import { createBudget, updateBudget, deleteBudget } from '@/app/(dashboard)/actions'

export function BudgetDialog({ budget, categories }: { budget?: any, categories: any[] }) {
  const [open, setOpen] = useState(false)
  const isEdit = !!budget

  async function action(formData: FormData) {
    if (isEdit) {
      await updateBudget(budget.id, formData)
    } else {
      await createBudget(formData)
    }
    setOpen(false)
  }

  async function handleDelete() {
    if (window.confirm('¿Seguro que deseas eliminar este presupuesto?')) {
      await deleteBudget(budget.id)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isEdit ? (
          <DialogTrigger {...({ asChild: true } as any)}>
            <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger {...({ asChild: true } as any)}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white absolute top-4 right-4">
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
            <DialogTitle>{isEdit ? 'Editar Presupuesto' : 'Crear Presupuesto'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modifica el límite de tu presupuesto.' : 'Establece un límite de gasto mensual para una categoría.'}
            </DialogDescription>
          </DialogHeader>
          <form action={action} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <select 
                id="categoryId" 
                name="categoryId" 
                required 
                defaultValue={budget?.categoryId || ""} 
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.filter((c: any) => c.type === 'EXPENSE').map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Límite Mensual (€)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                required 
                defaultValue={budget?.amount} 
                placeholder="Ej: 300" 
                className="rounded-xl" 
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all">
                {isEdit ? 'Guardar Cambios' : 'Crear Presupuesto'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
