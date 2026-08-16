import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vehiclesTable = sqliteTable("vehicles_table", {
  id: int().primaryKey({ autoIncrement: true }),
  make: text().notNull(),
  model: text().notNull(),
  year: int().notNull(),
  nickname: text(),
  createdAt: int({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
