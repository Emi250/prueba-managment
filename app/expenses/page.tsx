import { Suspense } from "react"
import { getExpenses, getPropertiesForExpenses, deleteExpense } from "@/app/actions/expenses"
import { NewExpenseButton } from "@/components/new-expense-button"
import { ExpenseFilters } from "@/components/expense-filters"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
import { Trash2, TrendingDown, Receipt, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)
}

interface ExpensesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const params = await searchParams
  const selectedProperty = typeof params.property === 'string' ? params.property : 'all'
  const selectedYear = typeof params.year === 'string' ? params.year : 'all'
  const selectedMonth = typeof params.month === 'string' ? params.month : 'all'

  const allExpenses = await getExpenses()
  const properties = await getPropertiesForExpenses()

  // Calculate distinct years from all expenses for the filter dropdown
  const yearsSet = new Set<number>()
  allExpenses.forEach(exp => yearsSet.add(exp.date.getFullYear()))
  const availableYears = Array.from(yearsSet).sort((a, b) => b - a)

  // Apply filters
  const filteredExpenses = allExpenses.filter(expense => {
    if (selectedProperty !== 'all' && expense.propertyId !== selectedProperty) return false
    if (selectedYear !== 'all' && expense.date.getFullYear().toString() !== selectedYear) return false
    if (selectedMonth !== 'all' && (expense.date.getMonth() + 1).toString() !== selectedMonth) return false
    return true
  })

  // Calculate totals
  const historicalTotal = allExpenses.reduce((acc, exp) => acc + exp.amount, 0)
  const filteredTotal = filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0)
  
  const hasFilters = selectedProperty !== 'all' || selectedYear !== 'all' || selectedMonth !== 'all'

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Gastos</h1>
          <p className="text-muted-foreground mt-1">Registra y controla los egresos de tus propiedades.</p>
        </div>
        <NewExpenseButton properties={properties} />
      </div>
      <Suspense fallback={<div className="h-14 w-full bg-muted/20 animate-pulse rounded-lg border"></div>}>
        <ExpenseFilters properties={properties} years={availableYears} />
      </Suspense>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Históricos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(historicalTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total absoluto</p>
          </CardContent>
        </Card>
        <Card className={hasFilters ? "border-primary/50 shadow-sm" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {hasFilters ? "Gastos Filtrados" : "Gastos Totales"}
            </CardTitle>
            {hasFilters ? (
              <Filter className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hasFilters ? 'text-primary' : ''}`}>
              {formatCurrency(filteredTotal)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hasFilters ? "Según filtros seleccionados" : "Mismo que el histórico"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Gastos</CardTitle>
          <CardDescription>
            {hasFilters 
              ? `Mostrando ${filteredExpenses.length} gasto(s) con los filtros actuales.` 
              : "Listado detallado de todos los gastos registrados."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No hay gastos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasFilters ? "No hay gastos que coincidan con los filtros seleccionados." : "Aún no has registrado ningún gasto en tus propiedades."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Fecha</TableHead>
                    <TableHead>Propiedad</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id} className="group transition-colors">
                      <TableCell className="font-medium">
                        {format(new Date(expense.date), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className="bg-background">
                          {expense.property.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{expense.category}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            expense.expenseType === 'fijo' ? 'bg-blue-100 text-blue-800' :
                            expense.expenseType === 'variable' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {expense.expenseType.charAt(0).toUpperCase() + expense.expenseType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <form action={deleteExpense}>
                          <input type="hidden" name="id" value={expense.id} />
                          <button 
                            type="submit"
                            className="text-muted-foreground hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-red-50"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
