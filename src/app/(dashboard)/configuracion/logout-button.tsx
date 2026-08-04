import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/(auth)/login/actions'

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive" className="w-full sm:w-auto rounded-xl mt-4 sm:mt-0">
        <LogOut className="h-4 w-4 mr-2" />
        Cerrar Sesión
      </Button>
    </form>
  )
}
