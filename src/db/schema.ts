import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const actionEnum = pgEnum("action", ["allow", "disallow"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  minecraft_id: text().unique().notNull(),
  discord_id: text().unique().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey().notNull(),
  action: actionEnum().notNull(),
  guild_id: text().notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
});
