import { getCurrentUser, getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'
import { ProfileForm } from './profile-form'
import { WorkspaceUsers } from './workspace-users'
import { LogoutButton } from './logout-button'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getCurrentWorkspace()
  ])

  // Fetch workspace users (members of this space)
  const workspaceUsers = await prisma.workspaceUser.findMany({
    where: { workspaceId: workspace.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground mt-1">Administra tu perfil, preferencias y seguridad.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6">
        <ProfileForm user={user} />
        <WorkspaceUsers workspaceUsers={workspaceUsers} currentUserId={user.id} />
      </div>
    </div>
  )
}
