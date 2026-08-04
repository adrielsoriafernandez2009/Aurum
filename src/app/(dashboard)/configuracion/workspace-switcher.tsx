'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, Users, Plus, CheckCircle2, Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { setActiveWorkspace, createSharedWorkspace } from '../actions'

type Workspace = {
  id: string
  name: string
}

type WorkspaceUser = {
  role: string
  workspace: Workspace
}

export function WorkspaceSwitcher({
  personalWorkspace,
  sharedWorkspaces,
  activeWorkspaceId
}: {
  personalWorkspace: WorkspaceUser
  sharedWorkspaces: WorkspaceUser[]
  activeWorkspaceId: string
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  async function handleSwitch(workspaceId: string) {
    if (workspaceId === activeWorkspaceId) return
    setLoadingId(workspaceId)
    await setActiveWorkspace(workspaceId)
    setLoadingId(null)
  }

  async function handleCreate(formData: FormData) {
    setCreating(true)
    await createSharedWorkspace(formData)
    setCreating(false)
    setCreateOpen(false)
  }

  return (
    <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-emerald-500" />
          <CardTitle>Administrar Finanzas</CardTitle>
        </div>
        <CardDescription>Cambia entre tus finanzas personales y las compartidas con otras personas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Finanzas Personales */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-500 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Finanzas Personales
          </h3>
          <div 
            onClick={() => handleSwitch(personalWorkspace.workspace.id)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              activeWorkspaceId === personalWorkspace.workspace.id
                ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                : 'bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-emerald-200'
            }`}
          >
            <div>
              <p className="font-semibold">{personalWorkspace.workspace.name}</p>
              <p className="text-xs text-zinc-500 mt-1">Solo tú tienes acceso a esta cuenta.</p>
            </div>
            {activeWorkspaceId === personalWorkspace.workspace.id ? (
              <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Activa
              </span>
            ) : (
              <Button disabled={loadingId === personalWorkspace.workspace.id} variant="outline" size="sm" className="rounded-xl">
                {loadingId === personalWorkspace.workspace.id ? 'Cambiando...' : 'Entrar'}
              </Button>
            )}
          </div>
        </div>

        {/* Finanzas Compartidas */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Finanzas Compartidas
          </h3>
          
          {sharedWorkspaces.length === 0 ? (
            <p className="text-sm text-zinc-500 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
              No tienes ninguna cuenta compartida todavía.
            </p>
          ) : (
            sharedWorkspaces.map((wu) => (
              <div 
                key={wu.workspace.id}
                onClick={() => handleSwitch(wu.workspace.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  activeWorkspaceId === wu.workspace.id
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900'
                    : 'bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-indigo-200'
                }`}
              >
                <div>
                  <p className="font-semibold">{wu.workspace.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {wu.role === 'OWNER' ? 'Eres el propietario' : 'Eres un invitado'}
                  </p>
                </div>
                {activeWorkspaceId === wu.workspace.id ? (
                  <span className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Activa
                  </span>
                ) : (
                  <Button disabled={loadingId === wu.workspace.id} variant="outline" size="sm" className="rounded-xl">
                    {loadingId === wu.workspace.id ? 'Cambiando...' : 'Entrar'}
                  </Button>
                )}
              </div>
            ))
          )}

          <div className="pt-2">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger render={
                <Button variant="outline" className="w-full rounded-xl border-dashed border-2 hover:bg-zinc-50 dark:hover:bg-zinc-900" />
              }>
                <Plus className="h-4 w-4 mr-2" />
                Crear nueva cuenta compartida
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-white/20 dark:border-zinc-800/50">
                <DialogHeader>
                  <DialogTitle>Nueva Cuenta Compartida</DialogTitle>
                  <DialogDescription>
                    Crea un espacio separado para compartir gastos (ej: "Gastos de casa"). 
                    Podrás invitar a otras personas una vez creado.
                  </DialogDescription>
                </DialogHeader>
                <form action={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la cuenta</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Ej: Gastos de Casa" 
                      className="rounded-xl bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" 
                      required
                    />
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)} className="rounded-xl">
                      Cancelar
                    </Button>
                    <Button disabled={creating} type="submit" className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all">
                      {creating ? 'Creando...' : 'Crear Cuenta'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
