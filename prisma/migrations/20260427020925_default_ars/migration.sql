-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user',
    "propertyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "paymentMethod" TEXT,
    "expenseType" TEXT NOT NULL DEFAULT 'fijo',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "expenses_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_expenses" ("amount", "category", "createdAt", "currency", "date", "deletedAt", "description", "expenseType", "id", "notes", "paymentMethod", "propertyId", "updatedAt", "userId") SELECT "amount", "category", "createdAt", "currency", "date", "deletedAt", "description", "expenseType", "id", "notes", "paymentMethod", "propertyId", "updatedAt", "userId" FROM "expenses";
DROP TABLE "expenses";
ALTER TABLE "new_expenses" RENAME TO "expenses";
CREATE TABLE "new_properties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user',
    "name" TEXT NOT NULL,
    "address" TEXT,
    "zone" TEXT,
    "capacity" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_properties" ("address", "capacity", "createdAt", "currency", "deletedAt", "id", "name", "notes", "status", "updatedAt", "userId", "zone") SELECT "address", "capacity", "createdAt", "currency", "deletedAt", "id", "name", "notes", "status", "updatedAt", "userId", "zone" FROM "properties";
DROP TABLE "properties";
ALTER TABLE "new_properties" RENAME TO "properties";
CREATE TABLE "new_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user',
    "propertyId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "nights" INTEGER NOT NULL,
    "amountToPay" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "reservationStatus" TEXT NOT NULL DEFAULT 'confirmed',
    "bookingChannel" TEXT NOT NULL DEFAULT 'Airbnb',
    "guestsCount" INTEGER,
    "phone" TEXT,
    "platformCommission" REAL,
    "cleaningFee" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "reservations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reservations" ("amountToPay", "bookingChannel", "checkIn", "checkOut", "cleaningFee", "createdAt", "currency", "deletedAt", "guestName", "guestsCount", "id", "nights", "notes", "paymentStatus", "phone", "platformCommission", "propertyId", "reservationStatus", "updatedAt", "userId") SELECT "amountToPay", "bookingChannel", "checkIn", "checkOut", "cleaningFee", "createdAt", "currency", "deletedAt", "guestName", "guestsCount", "id", "nights", "notes", "paymentStatus", "phone", "platformCommission", "propertyId", "reservationStatus", "updatedAt", "userId" FROM "reservations";
DROP TABLE "reservations";
ALTER TABLE "new_reservations" RENAME TO "reservations";
CREATE TABLE "new_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT 'default-user',
    "mainCurrency" TEXT NOT NULL DEFAULT 'ARS',
    "incomeAllocationMethod" TEXT NOT NULL DEFAULT 'check-in',
    "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 1,
    "aiApiKeyEncrypted" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_settings" ("aiApiKeyEncrypted", "createdAt", "fiscalYearStartMonth", "id", "incomeAllocationMethod", "mainCurrency", "updatedAt", "userId") SELECT "aiApiKeyEncrypted", "createdAt", "fiscalYearStartMonth", "id", "incomeAllocationMethod", "mainCurrency", "updatedAt", "userId" FROM "settings";
DROP TABLE "settings";
ALTER TABLE "new_settings" RENAME TO "settings";
CREATE UNIQUE INDEX "settings_userId_key" ON "settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
