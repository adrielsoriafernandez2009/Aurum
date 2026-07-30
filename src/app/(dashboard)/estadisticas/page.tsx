import { getCurrentWorkspace } from '@/lib/data'
import { EstadisticasCharts } from '@/components/charts/estadisticas-charts'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function EstadisticasPage() {
  const workspace = await getCurrentWorkspace()
  
  const transactions = await prisma.transaction.findMany({
    where: { workspaceId: workspace.id },
    include: { category: true }
  })

  // Calculate dataEvolucion (Ingresos vs Gastos by Month for the current year)
  const currentYear = new Date().getFullYear()
  const monthlyData: Record<number, { ingresos: number, gastos: number }> = {}
  
  for (let i = 0; i < 12; i++) {
    monthlyData[i] = { ingresos: 0, gastos: 0 }
  }

  transactions.forEach(t => {
    if (t.date.getFullYear() === currentYear) {
      const month = t.date.getMonth()
      if (t.type === 'INCOME') monthlyData[month].ingresos += t.amount
      else monthlyData[month].gastos += t.amount
    }
  })

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const dataEvolucion = Object.keys(monthlyData).map(monthStr => {
    const month = parseInt(monthStr)
    return {
      name: monthNames[month],
      ingresos: monthlyData[month].ingresos,
      gastos: monthlyData[month].gastos
    }
  })

  // Calculate dataCategorias (Distribution of expenses by category)
  const categoryData: Record<string, number> = {}
  transactions.forEach(t => {
    if (t.type === 'EXPENSE' && t.category) {
      if (!categoryData[t.category.name]) categoryData[t.category.name] = 0
      categoryData[t.category.name] += t.amount
    }
  })

  const dataCategorias = Object.keys(categoryData).map(cat => ({
    name: cat,
    value: categoryData[cat]
  }))

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Estadísticas</h2>
        <p className="text-muted-foreground mt-1">Análisis detallado de tus finanzas.</p>
      </div>
      <EstadisticasCharts dataEvolucion={dataEvolucion} dataCategorias={dataCategorias} />
    </div>
  )
}
