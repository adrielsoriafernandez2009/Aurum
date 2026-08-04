'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shield, Trash2, UserPlus, AlertCircle } from 'lucide-react'
import { inviteToWorkspace, removeUserFromWorkspace } from '../actions'

type WorkspaceUserItem = {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function WorkspaceUsers({ 
  workspaceUsers, 
  currentUserId,
  isPersonalWorkspace
}: { 
  workspaceUsers: WorkspaceUserItem[]
  currentUserId: string
  isPersonalWorkspace: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwner = workspaceUsers.find(wu => wu.user.id === currentUserId)?.role === 'OWNER'

  async function handleInvite(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await inviteToWorkspace(formData)
      // reset form
      const form = document.getElementById('inviteForm') as HTMLFormElement
      form?.reset()
    } catch (e: any) {
      if (e.message === 'USER_NOT_FOUND') {
        setError('Esa persona no tiene cuenta. Debe registrarse en Aurum primero.')
      } else if (e.message === 'ALREADY_MEMBER') {
        setError('Esa persona ya está en este espacio.')
      } else {
        setError('Ocurrió un error al invitar.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(userId: string) {
    if (window.confirm('¿Seguro que deseas revocar el acceso a esta persona?')) {
      await removeUserFromWorkspace(userId)
    }
  }

  return (
    <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-rose-500" />
          <CardTitle>Cuentas Compartidas</CardTitle>
        </div>
        <CardDescription>
          {isPersonalWorkspace 
            ? 'Tu cuenta personal es totalmente privada y no se puede compartir.' 
            : 'Invita a otra persona para administrar vuestras finanzas en conjunto.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {isPersonalWorkspace ? (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 mb-2">
              Esta es tu cuenta personal y está protegida. Nadie más podrá acceder a ella.
            </p>
            <p className="text-xs text-zinc-400">
              Para compartir gastos con otra persona, crea una <strong className="font-medium text-emerald-500">Cuenta Compartida</strong> en el selector de arriba.
            </p>
          </div>
        ) : (
          <>
            {/* Lista de Miembros */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-500">Miembros Actuales</h3>
              {workspaceUsers.map((wu) => (
                <div key={wu.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <p className="font-medium text-sm">{wu.user.name || 'Sin Nombre'}</p>
                    <p className="text-xs text-zinc-500">{wu.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-md ${wu.role === 'OWNER' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {wu.role === 'OWNER' ? 'Propietario' : 'Miembro'}
                    </span>
                    
                    {isOwner && wu.user.id !== currentUserId && (
                      <button onClick={() => handleRemove(wu.user.id)} className="text-red-500 hover:text-red-600 transition-colors" title="Expulsar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario de Invitación */}
            {isOwner && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-zinc-500 mb-3">Invitar Miembro</h3>
                <form id="inviteForm" action={handleInvite} className="flex gap-4">
                  <Input 
                    name="email"
                    type="email"
                    placeholder="Correo del invitado..." 
                    className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 max-w-sm" 
                    required
                  />
                  <Button disabled={loading} variant="outline" className="rounded-xl bg-white/50 dark:bg-zinc-900/50">
                    {loading ? 'Buscando...' : <><UserPlus className="h-4 w-4 mr-2" /> Añadir</>}
                  </Button>
                </form>
                {error && (
                  <p className="flex items-center gap-2 text-sm text-rose-500 mt-2 font-medium">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        
      </CardContent>
    </Card>
  )
}
