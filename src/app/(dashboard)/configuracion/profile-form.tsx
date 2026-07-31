'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User as UserIcon } from 'lucide-react'
import { updateProfile } from '../actions'

export function ProfileForm({ user }: { user: { name: string | null, email: string } }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await updateProfile(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-indigo-500" />
          <CardTitle>Perfil de Usuario</CardTitle>
        </div>
        <CardDescription>Actualiza tu información personal.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name"
                defaultValue={user.name || ''} 
                className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user.email} 
                className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 opacity-60" 
                disabled 
              />
            </div>
          </div>
          <Button disabled={loading} className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
