"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getExpenses() {
  const expenses = await prisma.expense.findMany({
    include: {
      property: true
    },
    orderBy: {
      date: 'desc'
    }
  })
  return expenses
}

export async function getPropertiesForExpenses() {
  const properties = await prisma.property.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return properties
}

export async function addExpense(formData: FormData) {
  const propertyId = formData.get("propertyId") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const dateStr = formData.get("date") as string
  const amountStr = formData.get("amount") as string
  const expenseType = formData.get("expenseType") as string

  if (!propertyId || !description || !category || !dateStr || !amountStr) {
    return
  }

  // Fix timezone issue by appending time
  const date = new Date(`${dateStr}T12:00:00`)
  const amount = parseFloat(amountStr)

  await prisma.expense.create({
    data: {
      propertyId,
      description,
      category,
      date,
      amount,
      expenseType: expenseType || 'fijo',
      currency: 'ARS',
    }
  })
  
  revalidatePath('/', 'layout')
}

export async function deleteExpense(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  await prisma.expense.delete({
    where: { id }
  })
  
  revalidatePath('/', 'layout')
}
