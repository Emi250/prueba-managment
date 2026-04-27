"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ReportFiltersProps {
  properties: { id: string, name: string }[]
  years: number[]
}

export function ReportFilters({ properties, years }: ReportFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentProperty = searchParams.get("property") || "all"
  const currentYear = searchParams.get("year") || "all"

  const updateFilters = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/reports?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(`/reports`)
  }

  const hasFilters = currentProperty !== "all" || currentYear !== "all"

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3 shadow-sm">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Propiedad</label>
        <Select value={currentProperty} onValueChange={(val) => updateFilters("property", val)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas">
              {currentProperty === "all" ? "Todas las propiedades" : properties.find(p => p.id === currentProperty)?.name || currentProperty}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las propiedades</SelectItem>
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Año</label>
        <Select value={currentYear} onValueChange={(val) => updateFilters("year", val)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Todos">
              {currentYear === "all" ? "Histórico Completo" : currentYear}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Histórico Completo</SelectItem>
            {years.map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <div className="space-y-1">
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-10 text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      )}
    </div>
  )
}
