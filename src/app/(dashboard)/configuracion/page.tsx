import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Bell, Shield, Moon } from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground mt-1">Administra tu perfil, preferencias y seguridad.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              <CardTitle>Perfil de Usuario</CardTitle>
            </div>
            <CardDescription>Actualiza tu información personal y foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue="Adriel" className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" defaultValue="hola@ejemplo.com" className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800" disabled />
              </div>
            </div>
            <Button className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all">Guardar Cambios</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-sm rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-rose-500" />
              <CardTitle>Cuentas Compartidas</CardTitle>
            </div>
            <CardDescription>Invita a otra persona para administrar vuestras finanzas en conjunto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input placeholder="Correo del invitado..." className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 max-w-sm" />
              <Button variant="outline" className="rounded-xl bg-white/50 dark:bg-zinc-900/50">Enviar Invitación</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
