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
import { addProperty } from "@/app/actions/properties"
import { Plus } from "lucide-react"

export function NewPropertyButton() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    await addProperty(formData)
    setOpen(false) // Close modal on submit
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground" />}>
        <Plus className="mr-2 h-4 w-4" /> Añadir Propiedad
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Propiedad</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre / Alias *</Label>
            <Input id="name" name="name" placeholder="Ej. Airbnb Palermo Soho" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" placeholder="Ej. Costa Rica 4500, CABA" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zone">Zona / Barrio</Label>
              <Input id="zone" name="zone" placeholder="Ej. Palermo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidad (Huéspedes)</Label>
              <Input id="capacity" name="capacity" type="number" min="1" placeholder="Ej. 4" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas o Enlace del Listado</Label>
            <Input id="notes" name="notes" placeholder="Ej. URL de Airbnb o notas de acceso" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Guardar Propiedad</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
