import { PrismaClient } from '@prisma/client'
import { addDays, subDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Check if data already exists
  const existingProperties = await prisma.property.count()
  if (existingProperties > 0) {
    console.log('Database already seeded')
    return
  }

  console.log('Seeding database...')

  // Create Properties
  const prop1 = await prisma.property.create({
    data: {
      name: 'Airbnb 1',
      address: 'Dirección 1',
      zone: 'Zona 1',
      capacity: 4,
      status: 'active',
      currency: 'ARS',
    },
  })

  const prop2 = await prisma.property.create({
    data: {
      name: 'Airbnb 2',
      address: 'Dirección 2',
      zone: 'Zona 2',
      capacity: 2,
      status: 'active',
      currency: 'ARS',
    },
  })

  const prop3 = await prisma.property.create({
    data: {
      name: 'Airbnb 3',
      address: 'Dirección 3',
      zone: 'Zona 3',
      capacity: 6,
      status: 'active',
      currency: 'ARS',
    },
  })

  const prop4 = await prisma.property.create({
    data: {
      name: 'Airbnb 4',
      address: 'Dirección 4',
      zone: 'Zona 4',
      capacity: 2,
      status: 'active',
      currency: 'ARS',
    },
  })

  // Create Settings
  await prisma.settings.create({
    data: {
      userId: 'default-user',
      mainCurrency: 'ARS',
      incomeAllocationMethod: 'check-in',
    },
  })

  // Create Reservations
  const today = new Date()
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  
  await prisma.reservation.createMany({
    data: [
      {
        propertyId: prop1.id,
        guestName: 'John Doe',
        checkIn: addDays(currentMonthStart, 5),
        checkOut: addDays(currentMonthStart, 10),
        nights: 5,
        amountToPay: 312300,
        currency: 'ARS',
        paymentStatus: 'paid',
        reservationStatus: 'confirmed',
        bookingChannel: 'Airbnb',
        guestsCount: 2,
        phone: '+54 9 11 1234-5678',
        cleaningFee: 20000,
      },
      {
        propertyId: prop1.id,
        guestName: 'Maria Garcia',
        checkIn: subDays(currentMonthStart, 10),
        checkOut: subDays(currentMonthStart, 2),
        nights: 8,
        amountToPay: 500000,
        currency: 'ARS',
        paymentStatus: 'paid',
        reservationStatus: 'finished',
        bookingChannel: 'Booking',
        guestsCount: 4,
        phone: '+54 9 11 8765-4321',
        cleaningFee: 25000,
      },
      {
        propertyId: prop2.id,
        guestName: 'Carlos Perez',
        checkIn: addDays(currentMonthStart, 15),
        checkOut: addDays(currentMonthStart, 18),
        nights: 3,
        amountToPay: 281800,
        currency: 'ARS',
        paymentStatus: 'pending',
        reservationStatus: 'confirmed',
        bookingChannel: 'Airbnb',
        guestsCount: 2,
        phone: '+54 9 3704 27-0299',
        cleaningFee: 15000,
      },
      {
        propertyId: prop3.id,
        guestName: 'Ana Smith',
        checkIn: addDays(today, 2),
        checkOut: addDays(today, 7),
        nights: 5,
        amountToPay: 400000,
        currency: 'ARS',
        paymentStatus: 'partial',
        reservationStatus: 'confirmed',
        bookingChannel: 'Directo',
        guestsCount: 5,
        phone: '+54 9 11 5555-5555',
        cleaningFee: 30000,
      },
      {
        propertyId: prop4.id,
        guestName: 'Laura Gomez',
        checkIn: addDays(today, 10),
        checkOut: addDays(today, 12),
        nights: 2,
        amountToPay: 99000,
        currency: 'ARS',
        paymentStatus: 'paid',
        reservationStatus: 'confirmed',
        bookingChannel: 'Airbnb',
        guestsCount: 1,
        phone: '+54 9 11 2222-3333',
        cleaningFee: 40,
      }
    ],
  })

  // Create Expenses
  await prisma.expense.createMany({
    data: [
      {
        propertyId: prop1.id,
        date: subDays(currentMonthStart, 5),
        category: 'Limpieza',
        description: 'Limpieza general',
        amount: 50,
        currency: 'ARS',
        expenseType: 'variable',
      },
      {
        propertyId: prop1.id,
        date: subDays(currentMonthStart, 15),
        category: 'Expensas',
        description: 'Expensas mensuales',
        amount: 120,
        currency: 'USD',
        expenseType: 'fijo',
      },
      {
        propertyId: prop2.id,
        date: addDays(currentMonthStart, 2),
        category: 'Reparaciones',
        description: 'Arreglo de cañería',
        amount: 80,
        currency: 'USD',
        expenseType: 'extraordinario',
      },
      {
        propertyId: prop3.id,
        date: addDays(currentMonthStart, 10),
        category: 'Servicios',
        description: 'Internet y Cable',
        amount: 40,
        currency: 'USD',
        expenseType: 'fijo',
      }
    ]
  })

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
