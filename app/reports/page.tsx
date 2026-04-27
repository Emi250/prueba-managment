import { Suspense } from "react"
import { getReportData } from "@/app/actions/reports"
import { ReportFilters } from "@/components/report-filters"
import { CashFlowChart } from "@/components/charts/cash-flow-chart"
import { IncomePieChart } from "@/components/charts/income-pie-chart"
import { ExpensePieChart } from "@/components/charts/expense-pie-chart"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
}

interface ReportsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams
  const selectedProperty = typeof params.property === 'string' ? params.property : 'all'
  const selectedYear = typeof params.year === 'string' ? params.year : 'all'

  const data = await getReportData(selectedYear, selectedProperty)

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Reporte de Rentabilidad</h1>
        <p className="text-muted-foreground mt-1">Análisis financiero y métricas clave de tu negocio.</p>
      </div>

      <Suspense fallback={<div className="h-14 w-full bg-muted/20 animate-pulse rounded-lg border"></div>}>
        <ReportFilters properties={data.properties} years={data.availableYears} />
      </Suspense>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Brutos</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(data.kpis.totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Facturación total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(data.kpis.totalExpense)}</div>
            <p className="text-xs text-muted-foreground mt-1">Gastos operativos</p>
          </CardContent>
        </Card>
        <Card className="border-primary/50 shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Rentabilidad Neta</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(data.kpis.netProfit)}</div>
            <p className="text-xs text-primary/80 mt-1">Ingresos menos egresos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Sobre ingresos brutos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Flujo de Caja Anual</CardTitle>
            <CardDescription>
              Comparativa mensual de ingresos vs egresos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <CashFlowChart data={data.cashFlow} />
          </CardContent>
        </Card>
        <div className="lg:col-span-3 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Propiedad</CardTitle>
              <CardDescription>
                Distribución de la facturación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncomePieChart data={data.incomeByProperty} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoría</CardTitle>
              <CardDescription>
                En qué se gasta el dinero.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensePieChart data={data.expensesByCategory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
