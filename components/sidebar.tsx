"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CalendarDays, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  Home, 
  Sparkles,
  Building2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendario",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Ingresos",
    href: "/income",
    icon: DollarSign,
  },
  {
    title: "Gastos",
    href: "/expenses",
    icon: CreditCard,
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Propiedades",
    href: "/properties",
    icon: Home,
  },
  {
    title: "Análisis IA",
    href: "/ai-summary",
    icon: Sparkles,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur md:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link href="/" className="flex items-center gap-3 font-semibold text-sidebar-foreground">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm">Airbnb Manager</span>
              <span className="block text-xs font-normal text-muted-foreground">Operaciones</span>
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 overflow-auto py-4">
          <nav className="grid items-start gap-1 px-3 text-sm font-medium">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary hover:text-primary-foreground" : ""
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-accent/70 p-3 text-xs text-accent-foreground">
            <p className="font-medium">Vista ejecutiva</p>
            <p className="mt-1 text-muted-foreground">Ingresos, gastos y ocupación en un solo lugar.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
