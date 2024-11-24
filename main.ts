import { registerCommands } from "./src/bot/commands.ts";
import { getCurrentStates } from "./src/db/db.ts";
import { seed } from "./src/db/seed.ts";

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
  console.log(await getCurrentStates("1079492811126231051"))
} else {
  console.log("Example usage: deno run --env -A main.ts [register | run]");
  Deno.exit(1);
}

// deno run --env -A ./src/bot/commands.ts
// deno run --env -A main.ts register
// deno compile
// ./mcauth.exe --env register
