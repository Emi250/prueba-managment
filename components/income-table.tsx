"use client"

import { Fragment, useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Home, ChevronDown, ChevronUp, ExternalLink, Calendar, Type, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Reservation {
  id: string
  guestName: string
  checkIn: Date
  checkOut: Date
  amountToPay: number
  paymentStatus: string
}

interface PropertyIncome {
  id: string
  name: string
  filteredReservationsCount: number
  paidIncome: number
  pendingIncome: number
  totalIncome: number
  validReservations: Reservation[]
}

interface IncomeTableProps {
  data: PropertyIncome[]
}

export function IncomeTable({ data }: IncomeTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedRows(newSet)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short' }).format(new Date(date))
  }

  if (data.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 text-muted-foreground">
        <DollarSign className="h-8 w-8 mb-2 opacity-50" />
        <p className="font-medium text-sm">No hay ingresos para los filtros aplicados</p>
        <p className="text-xs opacity-75 mt-1">Intenta seleccionar otro mes o año.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Propiedad</TableHead>
            <TableHead className="text-right">Reservas</TableHead>
            <TableHead className="text-right">Cobrado</TableHead>
            <TableHead className="text-right">Pendiente</TableHead>
            <TableHead className="text-right font-bold text-foreground">Total Proyectado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((prop) => (
            <Fragment key={prop.id}>
              <TableRow 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleRow(prop.id)}
              >
                <TableCell>
                  {expandedRows.has(prop.id) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <Home className="h-4 w-4" />
                    </div>
                    {prop.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-normal">{prop.filteredReservationsCount}</Badge>
                </TableCell>
                <TableCell className="text-right text-emerald-600 font-medium">{formatCurrency(prop.paidIncome)}</TableCell>
                <TableCell className="text-right text-amber-600 font-medium">{formatCurrency(prop.pendingIncome)}</TableCell>
                <TableCell className="text-right font-bold text-lg">{formatCurrency(prop.totalIncome)}</TableCell>
              </TableRow>
              
              {expandedRows.has(prop.id) && (
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableCell colSpan={6} className="p-0">
                    <div className="px-14 py-4 space-y-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Desglose de Reservas ({prop.name})
                      </h4>
                      <div className="rounded-md border bg-background shadow-sm overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/30">
                            <TableRow>
                              <TableHead className="text-xs h-8">Huésped</TableHead>
                              <TableHead className="text-xs h-8">Fechas</TableHead>
                              <TableHead className="text-xs h-8">Estado de Pago</TableHead>
                              <TableHead className="text-xs h-8 text-right">Monto</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prop.validReservations.map(res => (
                              <TableRow key={res.id}>
                                <TableCell className="py-2">
                                  <div className="flex items-center gap-2 font-medium text-sm">
                                    <Type className="h-3 w-3 text-muted-foreground" />
                                    {res.guestName}
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">
                                  {formatDate(res.checkIn)} - {formatDate(res.checkOut)}
                                </TableCell>
                                <TableCell className="py-2">
                                  {res.paymentStatus === 'paid' ? (
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800">Cobrado</Badge>
                                  ) : res.paymentStatus === 'partial' ? (
                                    <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">Parcial</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800">Pendiente</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="py-2 text-right font-medium text-sm">
                                  {formatCurrency(res.amountToPay)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
