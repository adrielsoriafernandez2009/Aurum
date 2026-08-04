import { getCurrentUser, getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'
import { ProfileForm } from './profile-form'
import { WorkspaceUsers } from './workspace-users'
import { LogoutButton } from './logout-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const [user, workspace] = await Promise.all([
    getCurrentUser(),
    getCurrentWorkspace()
  ])

  // Fetch ALL workspaces for the user to pass to the switcher
  const allUserWorkspaces = await prisma.workspaceUser.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: 'asc' } }
  })
  
  const personalWorkspace = allUserWorkspaces.find(wu => wu.role === 'OWNER') || allUserWorkspaces[0]
  const sharedWorkspaces = allUserWorkspaces.filter(wu => wu.workspace.id !== personalWorkspace.workspace.id)

  // Fetch workspace users for the CURRENT ACTIVE space (members of this space)
  const currentWorkspaceUsers = await prisma.workspaceUser.findMany({
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
        <WorkspaceSwitcher 
          personalWorkspace={personalWorkspace as any}
          sharedWorkspaces={sharedWorkspaces as any}
          activeWorkspaceId={workspace.id}
        />
        
        <ProfileForm user={user} />
        
        <WorkspaceUsers workspaceUsers={currentWorkspaceUsers} currentUserId={user.id} />
      </div>
    </div>
  )
}

