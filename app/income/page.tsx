import { Suspense } from "react"
import { getReservationsGroupedByProperty } from "@/app/actions/reservations"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Home, DollarSign, Wallet } from "lucide-react"
import { IncomeFilters } from "@/components/income-filters"
import { IncomeTable } from "@/components/income-table"

export default async function IncomePage({
  searchParams,
}: {
  searchParams: { property?: string; year?: string; month?: string }
}) {
  const properties = await getReservationsGroupedByProperty()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
  }

  // Basic filters from URL
  const selectedProperty = searchParams.property || "all"
  const selectedYear = searchParams.year || "all"
  const selectedMonth = searchParams.month || "all"

  // Gather available years for the filter dropdown
  const allYears = new Set<number>()
  properties.forEach(p => {
    p.reservations.forEach(r => {
      allYears.add(new Date(r.checkIn).getFullYear())
      allYears.add(new Date(r.checkOut).getFullYear())
    })
  })
  const years = Array.from(allYears).sort((a, b) => b - a)
  
  // Filter properties
  const filteredProperties = properties.filter(p => selectedProperty === "all" || p.id === selectedProperty)

  // Calculate totals per property with reservation-level filters
  const propertyIncomes = filteredProperties.map(property => {
    
    // Apply time filters to reservations
    const validReservations = property.reservations.filter(r => {
      const inDate = new Date(r.checkIn)
      const matchesYear = selectedYear === "all" || inDate.getFullYear().toString() === selectedYear
      const matchesMonth = selectedMonth === "all" || (inDate.getMonth() + 1).toString() === selectedMonth
      return matchesYear && matchesMonth && r.reservationStatus !== "cancelled"
    })

    const paidIncome = validReservations
      .filter(r => r.paymentStatus === "paid")
      .reduce((sum, r) => sum + r.amountToPay, 0)
      
    const pendingIncome = validReservations
      .filter(r => r.paymentStatus !== "paid")
      .reduce((sum, r) => sum + r.amountToPay, 0)

    const totalIncome = paidIncome + pendingIncome
    
    return {
      ...property,
      filteredReservationsCount: validReservations.length,
      paidIncome,
      pendingIncome,
      totalIncome,
      validReservations
    }
  }).filter(p => p.filteredReservationsCount > 0 || selectedProperty !== "all") 
  // If "all" properties selected, only show those with data matching the filters.
  // If a specific property is selected, show it even if it has 0 to confirm no data.

  const totalGlobalIncome = propertyIncomes.reduce((sum, p) => sum + p.totalIncome, 0)
  const totalGlobalPaid = propertyIncomes.reduce((sum, p) => sum + p.paidIncome, 0)
  const totalGlobalPending = propertyIncomes.reduce((sum, p) => sum + p.pendingIncome, 0)

  const propertiesList = properties.map(p => ({ id: p.id, name: p.name }))

  // Helper calculation for progress bar
  const calculateProgress = (paid: number, total: number) => {
    if (total === 0) return 0
    return Math.round((paid / total) * 100)
  }
  const globalProgress = calculateProgress(totalGlobalPaid, totalGlobalIncome)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ingresos Generados</h1>
          <p className="text-muted-foreground mt-1">Gestión avanzada de flujos de dinero.</p>
        </div>
      </div>

      <Suspense fallback={<div className="h-14 w-full bg-muted/20 animate-pulse rounded-lg border"></div>}>
        <IncomeFilters properties={propertiesList} years={years} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bruto Proyectado
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(totalGlobalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Según los filtros aplicados
            </p>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-right">
              {globalProgress}% ya cobrado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Cobrados
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalGlobalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pagos completados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Pendientes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalGlobalPending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              A cobrar (Pendiente / Parcial)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desglose por Propiedad</CardTitle>
          <CardDescription>
            Haz clic en cada propiedad para ver el detalle de las reservas que componen este ingreso.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <IncomeTable data={propertyIncomes} />
        </CardContent>
      </Card>
    </div>
  )
}
