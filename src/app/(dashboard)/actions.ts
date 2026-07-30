'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

export async function createAccount(formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const initialBalance = parseFloat(formData.get('balance') as string || '0')
  const icon = formData.get('icon') as string || 'Wallet'

  await prisma.account.create({
    data: {
      workspaceId: workspace.id,
      name,
      type,
      balance: initialBalance,
      icon,
    }
  })

  // Also log the activity
  await prisma.activityLog.create({
    data: {
      workspaceId: workspace.id,
      action: 'CREATED_ACCOUNT',
      details: `Cuenta ${name} creada con saldo de ${initialBalance}€`
    }
  })

  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
}

export async function createTransaction(formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const accountId = formData.get('accountId') as string
  const categoryId = formData.get('categoryId') as string || null
  const type = formData.get('type') as string // INCOME, EXPENSE, TRANSFER
  const amount = parseFloat(formData.get('amount') as string || '0')
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  
  const date = dateStr ? new Date(dateStr) : new Date()

  // Verify the account belongs to workspace
  const account = await prisma.account.findFirst({
    where: { id: accountId, workspaceId: workspace.id }
  })

  if (!account) throw new Error('Account not found')

  // Create transaction
  await prisma.transaction.create({
    data: {
      workspaceId: workspace.id,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
    }
  })

  // Update account balance
  const balanceModifier = type === 'EXPENSE' ? -amount : type === 'INCOME' ? amount : 0;
  
  if (balanceModifier !== 0) {
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balanceModifier
        }
      }
    })
  }

  revalidatePath('/movimientos')
  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
}
