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

interface ExpenseFiltersProps {
  properties: { id: string, name: string }[]
  years: number[]
}

export function ExpenseFilters({ properties, years }: ExpenseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentProperty = searchParams.get("property") || "all"
  const currentYear = searchParams.get("year") || "all"
  const currentMonth = searchParams.get("month") || "all"

  const updateFilters = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/expenses?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(`/expenses`)
  }

  const hasFilters = currentProperty !== "all" || currentYear !== "all" || currentMonth !== "all"

  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

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
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Todos">
              {currentYear === "all" ? "Todos" : currentYear}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {years.map(y => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Mes</label>
        <Select value={currentMonth} onValueChange={(val) => updateFilters("month", val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todos">
              {currentMonth === "all" ? "Todos" : months.find(m => m.value === currentMonth)?.label || currentMonth}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {months.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
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
