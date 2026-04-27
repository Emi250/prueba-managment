import { getReservationsGroupedByProperty, deleteReservation } from "@/app/actions/reservations"
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
  ChevronDown,
  Calendar,
  Type,
  Hash,
  DollarSign,
  Phone,
  Home,
  Trash2
} from "lucide-react"
import { NewReservationButton } from "@/components/new-reservation-button"

export default async function CalendarViewPage() {
  const properties = await getReservationsGroupedByProperty()

  const propertiesList = properties.map(p => ({ id: p.id, name: p.name }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'decimal', minimumFractionDigits: 2 }).format(value) + " ARS" // Mapeado a ARS por la imagen
  }

  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="border-b border-border/70 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Calendario de Reservas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Seguimiento de check-ins, huéspedes y cobros pendientes.</p>
      </div>

      <div className="space-y-8 rounded-lg border bg-card p-4 shadow-sm">
        {properties.map((property) => (
          <div key={property.id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChevronDown className="h-4 w-4" />
              <div className="rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                {property.name}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]"><div className="flex items-center gap-2"><Home className="h-4 w-4" />Propiedad</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Check-in</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Check-out</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Type className="h-4 w-4" />Huésped</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><span className="text-xs font-bold">∑</span> Noches</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Hash className="h-4 w-4" />Huéspedes</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Hash className="h-4 w-4" />Monto a pagar</div></TableHead>
                    <TableHead><div className="flex items-center gap-2"><Phone className="h-4 w-4" />Teléfono</div></TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground h-24">
                        Sin reservas para mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    property.reservations.map((reservation) => (
                      <TableRow key={reservation.id} className="group">
                        <TableCell>
                          <div className="bg-amber-700/80 text-white w-max px-2 py-0.5 rounded text-xs font-medium">
                            {property.name}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                        <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Type className="h-3 w-3 text-muted-foreground" />
                            {reservation.guestName}
                          </div>
                        </TableCell>
                        <TableCell>{reservation.nights}</TableCell>
                        <TableCell>{reservation.guestsCount}</TableCell>
                        <TableCell>{formatCurrency(reservation.amountToPay)}</TableCell>
                        <TableCell>{reservation.phone || ''}</TableCell>
                        <TableCell>
                          <form action={deleteReservation}>
                            <input type="hidden" name="id" value={reservation.id} />
                            <button type="submit" className="text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
        
        <NewReservationButton properties={propertiesList} />
      </div>
    </div>
  )
}
