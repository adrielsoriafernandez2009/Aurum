'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Tags, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createCategory, deleteCategory } from '../actions'

type Category = {
  id: string
  name: string
  type: string
  color: string | null
}

const COLORS = [
  { name: 'Rojo', value: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', hex: '#ef4444' },
  { name: 'Naranja', value: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400', hex: '#f97316' },
  { name: 'Amarillo', value: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', hex: '#eab308' },
  { name: 'Verde', value: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400', hex: '#10b981' },
  { name: 'Azul', value: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', hex: '#3b82f6' },
  { name: 'Indigo', value: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400', hex: '#6366f1' },
  { name: 'Morado', value: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400', hex: '#a855f7' },
  { name: 'Rosa', value: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400', hex: '#ec4899' },
  { name: 'Gris', value: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400', hex: '#71717a' },
]

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value)
  const [type, setType] = useState('EXPENSE')

  async function handleCreate(formData: FormData) {
    setCreating(true)
    formData.set('color', selectedColor)
    await createCategory(formData)
    setCreating(false)
    setCreateOpen(false)
  }

  async function handleDelete(categoryId: string) {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría? Los movimientos asociados quedarán sin categoría.')) {
      await deleteCategory(categoryId).catch(err => alert(err.message))
    }
  }

  const expenses = categories.filter(c => c.type === 'EXPENSE')
  const incomes = categories.filter(c => c.type === 'INCOME')

  return (
    <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-indigo-500" />
          <CardTitle>Categorías Personalizadas</CardTitle>
        </div>
        <CardDescription>Crea o elimina las categorías para organizar mejor tus movimientos en este espacio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Gastos */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-500 border-b pb-2">Gastos</h3>
            <div className="flex flex-wrap gap-2">
              {expenses.map(cat => (
                <div key={cat.id} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border border-transparent hover:border-red-200 transition-colors ${cat.color || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                  {cat.name}
                  <button onClick={() => handleDelete(cat.id)} className="opacity-50 hover:opacity-100 hover:text-red-600 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {expenses.length === 0 && <p className="text-xs text-zinc-400">Sin categorías de gasto</p>}
            </div>
          </div>

          {/* Ingresos */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-500 border-b pb-2">Ingresos</h3>
            <div className="flex flex-wrap gap-2">
              {incomes.map(cat => (
                <div key={cat.id} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border border-transparent hover:border-red-200 transition-colors ${cat.color || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                  {cat.name}
                  <button onClick={() => handleDelete(cat.id)} className="opacity-50 hover:opacity-100 hover:text-red-600 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {incomes.length === 0 && <p className="text-xs text-zinc-400">Sin categorías de ingreso</p>}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger render={
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-dashed border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900" />
            }>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Categoría
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
              <DialogHeader>
                <DialogTitle>Nueva Categoría</DialogTitle>
                <DialogDescription>
                  Añade una etiqueta para agrupar tus movimientos.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="EXPENSE">Gasto</option>
                    <option value="INCOME">Ingreso</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Ej: Mascotas" 
                    className="rounded-xl bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" 
                    required
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <Label>Color de la etiqueta</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c.value ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)} className="rounded-xl">
                    Cancelar
                  </Button>
                  <Button disabled={creating} type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all">
                    {creating ? 'Creando...' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

      </CardContent>
    </Card>
  )
}
