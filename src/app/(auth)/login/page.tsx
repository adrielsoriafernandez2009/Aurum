import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Wallet className="w-6 h-6 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Bienvenido a Aurum</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Gestiona tus finanzas como un profesional</p>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="hola@ejemplo.com" required className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-xl h-11 transition-all focus:bg-white dark:focus:bg-zinc-950" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Contraseña</Label>
              <Input id="password" name="password" type="password" required className="bg-white/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 rounded-xl h-11 transition-all focus:bg-white dark:focus:bg-zinc-950" />
            </div>
            
            <div className="pt-2 flex flex-col gap-3">
              <Button type="submit" formAction={login} className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md transition-all">
                Iniciar sesión
              </Button>
              <Button type="submit" formAction={signup} variant="outline" className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                Crear cuenta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
