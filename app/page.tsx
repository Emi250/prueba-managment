import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CreditCard,
  DollarSign,
  Home,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react"

import { getDashboardMetrics } from "./actions/dashboard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value)
  }

  const statCards = [
    {
      title: "Ingresos del mes",
      value: formatCurrency(metrics.currentMonthIncome),
      detail: `${metrics.incomeChange >= 0 ? "+" : ""}${metrics.incomeChange.toFixed(1)}% vs mes anterior`,
      icon: DollarSign,
      tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
      trendIcon: metrics.incomeChange >= 0 ? ArrowUpRight : ArrowDownRight,
    },
    {
      title: "Gastos del mes",
      value: formatCurrency(metrics.currentMonthExpenses),
      detail: "Registrado para el periodo actual",
      icon: CreditCard,
      tone: "text-rose-700 bg-rose-50 border-rose-100",
      trendIcon: TrendingDown,
    },
    {
      title: "Ganancia neta",
      value: formatCurrency(metrics.currentNetProfit),
      detail: `Margen de ${metrics.currentMargin.toFixed(1)}%`,
      icon: TrendingUp,
      tone: metrics.currentNetProfit >= 0
        ? "text-blue-700 bg-blue-50 border-blue-100"
        : "text-rose-700 bg-rose-50 border-rose-100",
      trendIcon: metrics.currentNetProfit >= 0 ? ArrowUpRight : ArrowDownRight,
    },
    {
      title: "Ingresos anuales",
      value: formatCurrency(metrics.currentYearIncome),
      detail: `Año ${new Date().getFullYear()}`,
      icon: WalletCards,
      tone: "text-amber-700 bg-amber-50 border-amber-100",
      trendIcon: Home,
    },
  ]

  const alerts = [
    metrics.currentMargin < 15 && metrics.currentMargin > 0
      ? `Margen de ganancia bajo (${metrics.currentMargin.toFixed(1)}%).`
      : null,
    metrics.currentNetProfit < 0 ? "Pérdida neta proyectada este mes." : null,
    metrics.upcomingReservations.some((reservation) => reservation.amountToPay === 0)
      ? "Hay reservas próximas sin monto a pagar cargado."
      : null,
  ].filter((alert): alert is string => Boolean(alert))

  return (
    <div className="flex-1 space-y-6">
      <header className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="bg-background text-muted-foreground">
            Resumen operativo
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Panel de control</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rendimiento financiero, reservas próximas y alertas de tus propiedades.
            </p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
          <CalendarCheck className="h-4 w-4 text-primary" />
          {format(new Date(), "d 'de' MMMM, yyyy", { locale: es })}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="min-h-[154px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription>{card.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tracking-tight">{card.value}</CardTitle>
              </div>
              <span className={`flex size-10 items-center justify-center rounded-md border ${card.tone}`}>
                <card.icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <card.trendIcon className="h-3.5 w-3.5" />
                {card.detail}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Próximas reservas</CardTitle>
            <CardDescription>Las próximas 5 reservas confirmadas.</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.upcomingReservations.length === 0 ? (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center">
                <CalendarCheck className="mb-3 h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm font-medium">No hay próximas reservas</p>
                <p className="mt-1 text-xs text-muted-foreground">La agenda aparece acá cuando cargues reservas futuras.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/70 overflow-hidden rounded-lg border">
                {metrics.upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center gap-3 bg-card p-3">
                    <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      <span>{format(reservation.checkIn, "dd", { locale: es })}</span>
                      <span className="uppercase">{format(reservation.checkIn, "MMM", { locale: es })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{reservation.guestName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {reservation.property.name} · {format(reservation.checkIn, "dd MMM", { locale: es })} al{" "}
                        {format(reservation.checkOut, "dd MMM", { locale: es })}
                      </p>
                    </div>
                    <div className="text-right text-sm font-semibold text-emerald-700">
                      +{formatCurrency(reservation.amountToPay)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Señales operativas que conviene revisar.</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{alert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-center">
                <TrendingUp className="mb-3 h-8 w-8 text-emerald-600/70" />
                <p className="text-sm font-medium">Sin alertas críticas</p>
                <p className="mt-1 text-xs text-muted-foreground">Los indicadores principales están dentro de rango.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
