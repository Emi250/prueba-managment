"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProperties() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { reservations: true, expenses: true }
      }
    }
  })
  return properties
}

export async function addProperty(formData: FormData) {
  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const zone = formData.get("zone") as string
  const capacityStr = formData.get("capacity") as string
  const notes = formData.get("notes") as string

  if (!name) return

  await prisma.property.create({
    data: {
      name,
      address,
      zone,
      capacity: capacityStr ? parseInt(capacityStr) : null,
      notes,
      currency: "ARS",
      status: "active",
    }
  })

  revalidatePath('/', 'layout')
}

export async function deleteProperty(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  // In a real app we might soft-delete or handle cascades. 
  // For now, we will physically delete if no relations exist, or we can just soft-delete via status.
  // We'll change status to 'inactive' to prevent breaking foreign keys on reservations/expenses.
  await prisma.property.update({
    where: { id },
    data: { status: "inactive" }
  })

  revalidatePath('/', 'layout')
}

export async function activateProperty(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  await prisma.property.update({
    where: { id },
    data: { status: "active" }
  })

  revalidatePath('/', 'layout')
}
