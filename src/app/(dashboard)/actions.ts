'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentWorkspace } from '@/lib/data'
import prisma from '@/lib/prisma'

// --- ACCOUNTS ---
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

export async function updateAccount(id: string, formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  // For balance updates here, we might want to be careful not to override transaction history,
  // but for simplicity we allow direct edits of the balance.
  const balance = parseFloat(formData.get('balance') as string || '0')
  const icon = formData.get('icon') as string || 'Wallet'

  await prisma.account.update({
    where: { id, workspaceId: workspace.id },
    data: { name, type, balance, icon }
  })

  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
}

export async function deleteAccount(id: string) {
  const workspace = await getCurrentWorkspace()
  await prisma.account.delete({
    where: { id, workspaceId: workspace.id }
  })
  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
  revalidatePath('/movimientos')
}

// --- TRANSACTIONS ---
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
      data: { balance: { increment: balanceModifier } }
    })
  }

  revalidatePath('/movimientos')
  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
  revalidatePath('/estadisticas')
  revalidatePath('/presupuestos')
}

export async function updateTransaction(id: string, formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const accountId = formData.get('accountId') as string
  const categoryId = formData.get('categoryId') as string || null
  const type = formData.get('type') as string // INCOME, EXPENSE
  const amount = parseFloat(formData.get('amount') as string || '0')
  const description = formData.get('description') as string
  const dateStr = formData.get('date') as string
  const date = dateStr ? new Date(dateStr) : new Date()

  const oldTx = await prisma.transaction.findFirst({
    where: { id, workspaceId: workspace.id }
  })
  if (!oldTx) throw new Error('Not found')

  // Revert old transaction effect on account
  const oldModifier = oldTx.type === 'EXPENSE' ? -oldTx.amount : oldTx.type === 'INCOME' ? oldTx.amount : 0
  if (oldModifier !== 0) {
    await prisma.account.update({
      where: { id: oldTx.accountId },
      data: { balance: { decrement: oldModifier } }
    })
  }

  // Update transaction
  await prisma.transaction.update({
    where: { id },
    data: { accountId, categoryId, type, amount, description, date }
  })

  // Apply new transaction effect
  const newModifier = type === 'EXPENSE' ? -amount : type === 'INCOME' ? amount : 0
  if (newModifier !== 0) {
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: newModifier } }
    })
  }

  revalidatePath('/movimientos')
  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
  revalidatePath('/estadisticas')
  revalidatePath('/presupuestos')
}

export async function deleteTransaction(id: string) {
  const workspace = await getCurrentWorkspace()
  
  const oldTx = await prisma.transaction.findFirst({
    where: { id, workspaceId: workspace.id }
  })
  if (!oldTx) throw new Error('Not found')

  // Revert old transaction effect on account
  const oldModifier = oldTx.type === 'EXPENSE' ? -oldTx.amount : oldTx.type === 'INCOME' ? oldTx.amount : 0
  if (oldModifier !== 0) {
    await prisma.account.update({
      where: { id: oldTx.accountId },
      data: { balance: { decrement: oldModifier } }
    })
  }

  await prisma.transaction.delete({ where: { id } })

  revalidatePath('/movimientos')
  revalidatePath('/cuentas')
  revalidatePath('/dashboard')
  revalidatePath('/estadisticas')
  revalidatePath('/presupuestos')
}

// --- BUDGETS ---
export async function createBudget(formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const categoryId = formData.get('categoryId') as string || null
  const amount = parseFloat(formData.get('amount') as string || '0')
  const period = formData.get('period') as string || 'MONTHLY'

  await prisma.budget.create({
    data: {
      workspaceId: workspace.id,
      categoryId,
      amount,
      period,
    }
  })

  revalidatePath('/presupuestos')
}

export async function updateBudget(id: string, formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const categoryId = formData.get('categoryId') as string || null
  const amount = parseFloat(formData.get('amount') as string || '0')
  const period = formData.get('period') as string || 'MONTHLY'

  await prisma.budget.update({
    where: { id, workspaceId: workspace.id },
    data: { categoryId, amount, period }
  })
  revalidatePath('/presupuestos')
}

export async function deleteBudget(id: string) {
  const workspace = await getCurrentWorkspace()
  await prisma.budget.delete({
    where: { id, workspaceId: workspace.id }
  })
  revalidatePath('/presupuestos')
}

// --- GOALS ---
export async function createGoal(formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const targetAmount = parseFloat(formData.get('targetAmount') as string || '0')
  const savedAmount = parseFloat(formData.get('savedAmount') as string || '0')

  await prisma.goal.create({
    data: {
      workspaceId: workspace.id,
      name,
      targetAmount,
      savedAmount,
    }
  })

  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
}

export async function updateGoal(id: string, formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const targetAmount = parseFloat(formData.get('targetAmount') as string || '0')
  const savedAmount = parseFloat(formData.get('savedAmount') as string || '0')

  await prisma.goal.update({
    where: { id, workspaceId: workspace.id },
    data: { name, targetAmount, savedAmount }
  })
  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
}

export async function deleteGoal(id: string) {
  const workspace = await getCurrentWorkspace()
  await prisma.goal.delete({
    where: { id, workspaceId: workspace.id }
  })
  revalidatePath('/objetivos')
  revalidatePath('/dashboard')
}

// --- SUBSCRIPTIONS ---
export async function createSubscription(formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string || '0')
  const frequency = formData.get('frequency') as string || 'MONTHLY'
  const nextBillingStr = formData.get('nextBilling') as string
  const nextBilling = nextBillingStr ? new Date(nextBillingStr) : new Date()
  const accountId = formData.get('accountId') as string || null
  const categoryId = formData.get('categoryId') as string || null

  await prisma.subscription.create({
    data: {
      workspaceId: workspace.id,
      accountId,
      categoryId,
      name,
      price,
      frequency,
      nextBilling,
    }
  })

  revalidatePath('/suscripciones')
}

export async function updateSubscription(id: string, formData: FormData) {
  const workspace = await getCurrentWorkspace()
  
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string || '0')
  const frequency = formData.get('frequency') as string || 'MONTHLY'
  const nextBillingStr = formData.get('nextBilling') as string
  const nextBilling = nextBillingStr ? new Date(nextBillingStr) : new Date()
  const accountId = formData.get('accountId') as string || null
  const categoryId = formData.get('categoryId') as string || null

  await prisma.subscription.update({
    where: { id, workspaceId: workspace.id },
    data: { name, price, frequency, nextBilling, accountId, categoryId }
  })
  revalidatePath('/suscripciones')
}

export async function deleteSubscription(id: string) {
  const workspace = await getCurrentWorkspace()
  await prisma.subscription.delete({
    where: { id, workspaceId: workspace.id }
  })
  revalidatePath('/suscripciones')
}
