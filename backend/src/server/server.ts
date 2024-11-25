import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { getCurrentState, linkAccount, allow } from "../db/db.ts";
import { JWT_OPTIONS } from "../constants.ts";
import * as jose from 'https://deno.land/x/jose@v5.9.6/index.ts'

const app = new Hono();

app.get("/api/events", async (c) => {
  const token = (c.req.header("Authorization") || "").split(" ")[1];
  if (token.length === 0) {
    return c.json({ error: "Token not provided" }, 400);
  }

  const { payload } = await jose.jwtVerify<{ bearer: string }>(token, JWT_OPTIONS.key);
  const cursor = Number(c.req.query("cursor")) || 0;
  const states = await getCurrentState(payload.bearer, cursor);
  const latestState: { minecraft_id: string, action: string }[] = [];
  let lastCursor = cursor;

  states.forEach((state) => {
    latestState.push({
      minecraft_id: state.users.minecraft_id,
      action: state.events.action,
    })

    if (state.events.id > lastCursor) {
      lastCursor = state.events.id;
    }
  });

  return c.json({
    states: latestState,
    lastCursor: lastCursor,
  })
});

app.get("/link", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.json({ error: "Token not provided" }, 400);
  }

  const { payload } = await jose.jwtVerify<{ discord_id: string, guild_id: string | null }>(token, JWT_OPTIONS.key);

  setCookie(c, "discord_id", payload.discord_id);
  if (payload.guild_id) {
    setCookie(c, "guild_id", payload.guild_id);
  }

  // redirect to microsoft LIGMA
  return c.redirect("https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize");
});

app.get("/api/callback", async (c) => {
  const discordId = getCookie(c, "discord_id");
  const guildId = getCookie(c, "guild_id");
  
  if (!discordId) {
    return c.json({ error: "Discord ID not found" }, 400);
  }

  const minecraftId = ""
  const user = await linkAccount(discordId, minecraftId);
  if (guildId) {
    await allow(guildId, user.id);
    return c.text("Done. You can now join the server.");
  }

  return c.text("Done. Your account is now linked.");
});

export function startServer() {
  return Deno.serve(app.fetch);
}
