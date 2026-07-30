import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Goal" (
          "id" TEXT NOT NULL,
          "workspaceId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "targetAmount" DOUBLE PRECISION NOT NULL,
          "savedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "deadline" TIMESTAMP(3),
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Subscription" (
          "id" TEXT NOT NULL,
          "workspaceId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "price" DOUBLE PRECISION NOT NULL,
          "frequency" TEXT NOT NULL,
          "nextBilling" TIMESTAMP(3) NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "url" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "RecurringExpense" (
          "id" TEXT NOT NULL,
          "workspaceId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "amount" DOUBLE PRECISION NOT NULL,
          "frequency" TEXT NOT NULL,
          "nextDueDate" TIMESTAMP(3) NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "RecurringExpense_pkey" PRIMARY KEY ("id")
      );
    `);

    // Añadir foreign keys ignorando si ya existen
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Goal" ADD CONSTRAINT "Goal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    } catch(e) {}
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    } catch(e) {}

    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
    } catch(e) {}

    // Nuevas columnas para Subscription v18
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Subscription" ADD COLUMN "accountId" TEXT;`);
    } catch(e) {}
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Subscription" ADD COLUMN "categoryId" TEXT;`);
    } catch(e) {}
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
    } catch(e) {}
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
    } catch(e) {}

    return NextResponse.json({ success: true, message: "Tablas creadas correctamente en la base de datos de producción." })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
