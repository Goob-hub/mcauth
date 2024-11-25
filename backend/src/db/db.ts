import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { events, users } from "./schema.ts";
import { eq, gt, and } from "drizzle-orm/expressions";

export type EventRecord = {
  user_id: number,
  guild_id: string,
}

// Use pg driver.
const { Pool } = pg;

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema: { users, events },
});

// Declare a function that links a discord ID to minecraft ID
export async function linkAccount(minecraft_id: string, discord_id: string) {
  return (await db.insert(users).values({
    discord_id: discord_id,
    minecraft_id: minecraft_id,
  }).returning())[0];
}

export async function disallow(guild_id: string, user_id: number) {
  return await db.insert(events).values({
    user_id: user_id,
    guild_id: guild_id,
    action: "disallow",
  }).returning();
}

export async function disallowAll(records: EventRecord[]) {
  return await db.insert(events).values(
    records.map((record) => ({
      ...record,
      action: "disallow" as const 
    }))
  ).returning();
}

export async function allow( guild_id: string, user_id: number) {
  return await db.insert(events).values({
    user_id: user_id,
    guild_id: guild_id,
    action: "allow",
  }).returning();
}

export async function getUserByDiscordId(discord_id: string) {
  return (await db.select().from(users).where(eq(users.discord_id, discord_id)))[0];
}

export async function getUserByMinecraftId(minecraft_id: string) {
  return await db.select().from(users).where(
    eq(users.minecraft_id, minecraft_id),
  ).execute();
}

export async function getUser(id: number) {
  return await db.select().from(users).where(eq(users.id, id)).execute();
}

export async function getCurrentState(guildId: string, cursor = 0) {
  return await db.selectDistinctOn([events.user_id]).from(events).where(
    and(
      eq(events.guild_id, guildId),
      gt(events.id, cursor)
    )
  ).innerJoin(users, eq(events.user_id, users.id)).execute();
}