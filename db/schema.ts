import {
  int,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { MAINTENANCE_TYPES } from "@/types/maintenance-logs";

export const usersTable = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text(),
  email: text().notNull().unique(),
  emailVerified: int({ mode: "timestamp" }),
  image: text(),
});

export const accountsTable = sqliteTable(
  "accounts",
  {
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: int(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessionsTable = sqliteTable("sessions", {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: int({ mode: "timestamp" }).notNull(),
});

export const verificationTokensTable = sqliteTable(
  "verification_tokens",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: int({ mode: "timestamp" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

export const vehiclesTable = sqliteTable(
  "vehicles",
  {
    id: int().primaryKey({ autoIncrement: true }),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    make: text().notNull(),
    model: text().notNull(),
    year: int().notNull(),
    initialOdometer: int().notNull(),
    currentOdometer: int().notNull(),
    vin: text(),
    nickname: text(),
    createdAt: int({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [unique("vehicles_user_vin_unique").on(table.userId, table.vin)],
);

export const fuelLogsTable = sqliteTable("fuel_logs", {
  id: int().primaryKey({ autoIncrement: true }),
  vehicleId: int()
    .notNull()
    .references(() => vehiclesTable.id, { onDelete: "cascade" }),
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
    .references(() => vehiclesTable.id, { onDelete: "cascade" }),
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
    .references(() => vehiclesTable.id, { onDelete: "cascade" }),
  label: text().notNull(),
  intervalType: text({ enum: ["odometer", "date"] }).notNull(),
  intervalValue: int().notNull(),
  lastDoneAt: int({ mode: "timestamp" }).notNull(),
  lastDoneOdometer: int().notNull(),
});
