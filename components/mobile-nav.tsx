"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Menu, X } from "lucide-react"
import { sidebarNavItems } from "./sidebar"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </span>
          <span>Airbnb Manager</span>
        </Link>
        <button 
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 -mr-2 transition-colors hover:bg-muted"
          aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[65px] z-50 max-h-[calc(100vh-65px)] overflow-y-auto border-b bg-background/95 p-4 shadow-lg backdrop-blur">
          <nav className="grid gap-2">
            {sidebarNavItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-all hover:bg-muted hover:text-primary",
                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
