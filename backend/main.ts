import { seed } from "./src/db/seed.ts";
import { registerCommands, startBot } from "./src/bot/bot.ts";
import { startServer } from "./src/server/server.ts";

const action = Deno.args[0];
if (action === "register") {
  const token = Deno.env.get("BOT_TOKEN");
  const devGuildId = Deno.env.get("DEV_GUILD_ID");
  if (!token) {
    console.error("BOT_TOKEN is required to register commands");
    Deno.exit(1);
  }

  if (!devGuildId) {
    console.warn(
      "DEV_GUILD_ID is not set, commands will be registered globally",
    );
  }

  await registerCommands(token, devGuildId).then(() => console.log("Done.")).catch(console.error);
} else if (action === "seed") {
  seed();
} else if (action === "run") {
  await Promise.all([
    startServer(),
    startBot(Deno.env.get("BOT_TOKEN")!),
  ])
} else {
  console.log("Example usage: deno --env -A main.ts [register | run]");
  Deno.exit(1);
}
