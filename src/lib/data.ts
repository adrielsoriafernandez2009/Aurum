import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Ensure user exists in Prisma
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email! },
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
    }
  })

  return dbUser
}

export async function getCurrentWorkspace() {
  const user = await getCurrentUser()

  // Get user's workspaces
  const workspaceUsers = await prisma.workspaceUser.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: 'asc' } }
  })

  // Define Personal Workspace as the oldest one where user is OWNER
  let personalWorkspace = workspaceUsers.find(wu => wu.role === 'OWNER')?.workspace

  // Create a default workspace if none exists
  if (!personalWorkspace) {
    personalWorkspace = await prisma.workspace.create({
      data: {
        name: 'Mi Espacio Personal',
        users: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      }
    })

    // Create default categories for the new workspace
    await prisma.category.createMany({
      data: [
        { workspaceId: personalWorkspace.id, name: 'Alimentación', type: 'EXPENSE', icon: 'ShoppingCart', color: 'text-orange-500' },
        { workspaceId: personalWorkspace.id, name: 'Vivienda', type: 'EXPENSE', icon: 'Home', color: 'text-blue-500' },
        { workspaceId: personalWorkspace.id, name: 'Transporte', type: 'EXPENSE', icon: 'Car', color: 'text-gray-500' },
        { workspaceId: personalWorkspace.id, name: 'Ocio', type: 'EXPENSE', icon: 'Coffee', color: 'text-pink-500' },
        { workspaceId: personalWorkspace.id, name: 'Salario', type: 'INCOME', icon: 'Briefcase', color: 'text-emerald-500' },
      ]
    })
    
    workspaceUsers.push({ workspace: personalWorkspace, role: 'OWNER' } as any)
  }

  // Check cookie for active workspace
  const cookieStore = await cookies()
  const activeId = cookieStore.get('aurum_active_workspace')?.value

  if (activeId) {
    const selected = workspaceUsers.find(wu => wu.workspace.id === activeId)
    if (selected) {
      return selected.workspace
    }
  }

  return personalWorkspace
}
