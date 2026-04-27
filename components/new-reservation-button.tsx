"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addReservation } from "@/app/actions/reservations"
import { AlertCircle, Plus } from "lucide-react"

export function NewReservationButton({ properties }: { properties: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkInDate, setCheckInDate] = useState("")
  const hasProperties = properties.length > 0

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!hasProperties) return
    setLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      await addReservation(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="mt-4" />}>
        <Plus className="h-4 w-4" /> Nueva reserva
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Propiedad</Label>
            {!hasProperties ? (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Aún no tienes propiedades creadas. Ve a la pestaña de "Propiedades" para añadir una primero.</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {properties.map(p => (
                  <label key={p.id} className="cursor-pointer">
                    <input type="radio" name="propertyId" value={p.id} className="peer sr-only" required />
                    <div className="rounded-md border border-border bg-background p-2 text-center text-sm transition-all hover:border-primary/50 hover:bg-muted peer-focus-visible:ring-3 peer-focus-visible:ring-ring/25 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:shadow-sm">
                      {p.name}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestName">Huésped</Label>
            <Input id="guestName" name="guestName" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input 
                id="checkIn" 
                name="checkIn" 
                type="date" 
                required 
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input 
                id="checkOut" 
                name="checkOut" 
                type="date" 
                required 
                min={checkInDate}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestsCount">Nº Huéspedes</Label>
              <Input id="guestsCount" name="guestsCount" type="number" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountToPay">Monto a pagar (ARS)</Label>
              <Input id="amountToPay" name="amountToPay" type="number" min="0" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" placeholder="+54 9 11..." />
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={!hasProperties || loading}>
              {loading ? "Guardando..." : "Guardar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
