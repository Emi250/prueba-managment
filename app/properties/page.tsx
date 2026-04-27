import { getProperties, deleteProperty, activateProperty } from "@/app/actions/properties"
import { NewPropertyButton } from "@/components/new-property-button"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { MapPin, Users, Building, Activity, Archive, Link as LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function PropertiesPage() {
  const properties = await getProperties()
  
  const activeProperties = properties.filter(p => p.status === 'active')
  const inactiveProperties = properties.filter(p => p.status === 'inactive')

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Propiedades</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu portafolio de alquileres temporarios.</p>
        </div>
        <NewPropertyButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {activeProperties.map((property) => (
          <Card key={property.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{property.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {property.address || "Sin dirección registrada"}
                  </CardDescription>
                </div>
                <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                  Activa
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1 rounded-md border bg-muted/30 p-3">
                  <span className="text-muted-foreground flex items-center"><Building className="h-4 w-4 mr-1" /> Zona</span>
                  <span className="font-medium">{property.zone || "-"}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-md border bg-muted/30 p-3">
                  <span className="text-muted-foreground flex items-center"><Users className="h-4 w-4 mr-1" /> Capacidad</span>
                  <span className="font-medium">{property.capacity ? `${property.capacity} pax` : "-"}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-md border bg-muted/30 p-3">
                  <span className="text-muted-foreground flex items-center"><Activity className="h-4 w-4 mr-1" /> Reservas</span>
                  <span className="font-medium">{property._count?.reservations || 0}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-md border bg-muted/30 p-3">
                  <span className="text-muted-foreground flex items-center"><Activity className="h-4 w-4 mr-1" /> Gastos</span>
                  <span className="font-medium">{property._count?.expenses || 0}</span>
                </div>
              </div>
              {property.notes && (
                <div className="mt-4 text-sm text-muted-foreground bg-amber-50/50 p-3 rounded-md border border-amber-100 flex items-start gap-2">
                  <LinkIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{property.notes}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3">
              <form action={deleteProperty} className="w-full">
                <input type="hidden" name="id" value={property.id} />
                <button type="submit" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center">
                  <Archive className="h-4 w-4 mr-1.5" /> Archivar Propiedad
                </button>
              </form>
            </CardFooter>
          </Card>
        ))}

        {activeProperties.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No hay propiedades activas</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">Comienza agregando tu primera propiedad al portafolio para poder registrar reservas y gastos.</p>
          </div>
        )}
      </div>

      {inactiveProperties.length > 0 && (
        <div className="mt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4 flex items-center">
            <Archive className="h-5 w-5 mr-2 text-muted-foreground" />
            Propiedades Archivadas
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {inactiveProperties.map((property) => (
              <Card key={property.id} className="opacity-75 grayscale hover:grayscale-0 transition-all">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{property.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">Inactiva</Badge>
                  </div>
                </CardHeader>
                <CardFooter className="pt-0 pb-4">
                  <form action={activateProperty} className="w-full">
                    <input type="hidden" name="id" value={property.id} />
                    <button type="submit" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full text-left">
                      Reactivar Propiedad
                    </button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
