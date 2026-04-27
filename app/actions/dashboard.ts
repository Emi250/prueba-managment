"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardMetrics() {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  // Ingresos del mes actual
  const currentMonthReservations = await prisma.reservation.findMany({
    where: {
      checkIn: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      },
      reservationStatus: {
        not: "cancelled",
      }
    }
  })
  
  const currentMonthIncome = currentMonthReservations.reduce((acc, res) => acc + res.amountToPay, 0)

  // Gastos del mes actual
  const currentMonthExpensesData = await prisma.expense.findMany({
    where: {
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth,
      }
    }
  })
  
  const currentMonthExpenses = currentMonthExpensesData.reduce((acc, exp) => acc + exp.amount, 0)

  // Ingresos del mes anterior
  const lastMonthReservations = await prisma.reservation.findMany({
    where: {
      checkIn: {
        gte: firstDayOfLastMonth,
        lte: lastDayOfLastMonth,
      },
      reservationStatus: {
        not: "cancelled",
      }
    }
  })
  
  const lastMonthIncome = lastMonthReservations.reduce((acc, res) => acc + res.amountToPay, 0)

  const currentNetProfit = currentMonthIncome - currentMonthExpenses
  const currentMargin = currentMonthIncome > 0 ? (currentNetProfit / currentMonthIncome) * 100 : 0
  
  const incomeChange = lastMonthIncome === 0 ? 100 : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100

  // Próximas reservas
  const upcomingReservations = await prisma.reservation.findMany({
    where: {
      checkIn: {
        gte: today,
      },
      reservationStatus: {
        not: "cancelled",
      }
    },
    include: {
      property: true,
    },
    orderBy: {
      checkIn: "asc"
    },
    take: 5
  })

  // Ingreso Anual (Ejemplo simplificado)
  const currentYearStart = new Date(today.getFullYear(), 0, 1)
  const currentYearReservations = await prisma.reservation.findMany({
    where: {
      checkIn: {
        gte: currentYearStart,
      },
      reservationStatus: {
        not: "cancelled",
      }
    }
  })
  const currentYearIncome = currentYearReservations.reduce((acc, res) => acc + res.amountToPay, 0)

  return {
    currentMonthIncome,
    currentMonthExpenses,
    currentNetProfit,
    currentMargin,
    incomeChange,
    upcomingReservations,
    currentYearIncome
  }
}
