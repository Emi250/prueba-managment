"use server"

import { prisma } from "@/lib/prisma"

export async function getReportData(year: string, propertyId: string) {
  // Base filters
  const reservationFilter: any = { reservationStatus: "confirmed" }
  const expenseFilter: any = {}

  if (propertyId !== "all") {
    reservationFilter.propertyId = propertyId
    expenseFilter.propertyId = propertyId
  }

  // Fetch data
  const reservations = await prisma.reservation.findMany({
    where: reservationFilter,
    include: { property: true }
  })

  const expenses = await prisma.expense.findMany({
    where: expenseFilter,
    include: { property: true }
  })

  const properties = await prisma.property.findMany({
    orderBy: { name: 'asc' }
  })

  // Filter by year in JS (CheckIn for Income, Date for Expenses)
  // Or fetch all available years to return for the filter dropdown
  const availableYears = new Set<number>()
  reservations.forEach(r => availableYears.add(r.checkIn.getFullYear()))
  expenses.forEach(e => availableYears.add(e.date.getFullYear()))
  
  const currentYearInt = new Date().getFullYear()
  if (availableYears.size === 0) {
    availableYears.add(currentYearInt)
  }
  
  const sortedYears = Array.from(availableYears).sort((a, b) => b - a)

  // Apply Year filter if "all" is not selected.
  // Defaulting to "all" based on user implicit choices, but if requested we can filter.
  const filteredReservations = year === "all" 
    ? reservations 
    : reservations.filter(r => r.checkIn.getFullYear().toString() === year)

  const filteredExpenses = year === "all"
    ? expenses
    : expenses.filter(e => e.date.getFullYear().toString() === year)

  // 1. Calculate KPIs
  const totalIncome = filteredReservations.reduce((acc, r) => acc + r.amountToPay, 0)
  const totalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0)
  const netProfit = totalIncome - totalExpense
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

  // 2. Prepare Cash Flow Data (Monthly)
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const cashFlow = monthNames.map((month, index) => ({
    name: month,
    Ingresos: 0,
    Gastos: 0,
    monthIndex: index
  }))

  filteredReservations.forEach(r => {
    const monthIndex = r.checkIn.getMonth()
    cashFlow[monthIndex].Ingresos += r.amountToPay
  })

  filteredExpenses.forEach(e => {
    const monthIndex = e.date.getMonth()
    cashFlow[monthIndex].Gastos += e.amount
  })

  // 3. Income by Property
  const incomeByPropertyMap = new Map<string, number>()
  filteredReservations.forEach(r => {
    const current = incomeByPropertyMap.get(r.property.name) || 0
    incomeByPropertyMap.set(r.property.name, current + r.amountToPay)
  })
  const incomeByProperty = Array.from(incomeByPropertyMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // 4. Expenses by Category
  const expenseByCategoryMap = new Map<string, number>()
  filteredExpenses.forEach(e => {
    const current = expenseByCategoryMap.get(e.category) || 0
    expenseByCategoryMap.set(e.category, current + e.amount)
  })
  const expensesByCategory = Array.from(expenseByCategoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return {
    kpis: {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin
    },
    cashFlow,
    incomeByProperty,
    expensesByCategory,
    availableYears: sortedYears,
    properties
  }
}
