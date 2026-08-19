import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vehiclesTable = sqliteTable("vehicles", {
  id: int().primaryKey({ autoIncrement: true }),
  make: text().notNull(),
  model: text().notNull(),
  year: int().notNull(),
  currentOdometer: int().notNull(),
  vin: text().unique(),
  nickname: text(),
  createdAt: int({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const fuelLogsTable = sqliteTable("fuel_logs", {
  id: int().primaryKey({ autoIncrement: true }),
  vehicleId: int()
    .notNull()
    .references(() => vehiclesTable.id),
  date: int({ mode: "timestamp" }).notNull(),
  odometer: int().notNull(),
  fuelAmount: real().notNull(),
  pricePerUnit: real().notNull(),
  totalCost: real().notNull(),
  isFullTank: int({ mode: "boolean" }).notNull().default(true),
});
