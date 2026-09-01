import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MAINTENANCE_TYPES } from "@/types/maintenance-logs";

export const vehiclesTable = sqliteTable("vehicles", {
  id: int().primaryKey({ autoIncrement: true }),
  make: text().notNull(),
  model: text().notNull(),
  year: int().notNull(),
  initialOdometer: int().notNull(),
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

export const maintenanceLogsTable = sqliteTable("maintenance_logs", {
  id: int().primaryKey({ autoIncrement: true }),
  vehicleId: int()
    .notNull()
    .references(() => vehiclesTable.id),
  date: int({ mode: "timestamp" }).notNull(),
  odometer: int().notNull(),
  type: text({ enum: MAINTENANCE_TYPES }).notNull().default("other"),
  description: text(),
  cost: real().notNull(),
});

export const remindersTable = sqliteTable("reminders", {
  id: int().primaryKey({ autoIncrement: true }),
  vehicleId: int()
    .notNull()
    .references(() => vehiclesTable.id),
  label: text().notNull(),
  intervalType: text({ enum: ["odometer", "date"] }).notNull(),
  intervalValue: int().notNull(),
  lastDoneAt: int({ mode: "timestamp" }).notNull(),
  lastDoneOdometer: int().notNull(),
});
