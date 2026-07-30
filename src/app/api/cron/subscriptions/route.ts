import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel CRON secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is defined in env, we strictly verify it.
    // If we are testing locally without CRON_SECRET, we might allow it (optional).
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find all active subscriptions that are due today or earlier and have an account assigned
    const today = new Date();
    // Reset time to start of day for accurate comparison
    today.setHours(23, 59, 59, 999);

    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextBilling: {
          lte: today,
        },
        accountId: {
          not: null
        },
        categoryId: {
          not: null
        }
      },
      include: {
        account: true,
      }
    });

    if (dueSubscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions due today' });
    }

    const processedIds = [];

    // 3. Process each subscription
    for (const sub of dueSubscriptions) {
      if (!sub.accountId || !sub.categoryId) continue;

      // Create an expense transaction for this subscription
      await prisma.$transaction(async (tx) => {
        // Create the transaction
        await tx.transaction.create({
          data: {
            workspaceId: sub.workspaceId,
            accountId: sub.accountId!,
            categoryId: sub.categoryId!,
            type: 'EXPENSE',
            amount: sub.price,
            description: `Pago de suscripción: ${sub.name}`,
            date: new Date(),
          }
        });

        // Deduct balance from account
        await tx.account.update({
          where: { id: sub.accountId! },
          data: { balance: { decrement: sub.price } }
        });

        // Calculate next billing date
        const currentBilling = new Date(sub.nextBilling);
        let nextDate = new Date(currentBilling);
        
        // Ensure we advance it past today in case it's very old
        while (nextDate <= today) {
          if (sub.frequency === 'MONTHLY') {
            nextDate.setMonth(nextDate.getMonth() + 1);
          } else {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
        }

        // Update the subscription's next billing date
        await tx.subscription.update({
          where: { id: sub.id },
          data: { nextBilling: nextDate }
        });
      });

      processedIds.push(sub.id);
    }

    return NextResponse.json({ 
      success: true, 
      processedCount: processedIds.length,
      processedIds
    });

  } catch (error: any) {
    console.error('CRON Error processing subscriptions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
