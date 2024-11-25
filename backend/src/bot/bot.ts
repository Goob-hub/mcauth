import { Client, Events, type Guild } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { disallow, disallowAll, getCurrentState, getUserByDiscordId, type EventRecord } from "../db/db.ts";
import LinkCommand from "./commands/link.ts";
import PingCommand from "./commands/ping.ts";
import SetupCommand from "./commands/setup.ts";
import type Command from "./command.ts";


const client = new Client({ intents: ["GuildMembers"] });
const commands: Record<string, Command> = {
  link: new LinkCommand(),
  ping: new PingCommand(),
  setup: new SetupCommand(),
}
/**
 * Registering bot online one time, never again
 */
export function registerCommands(
  token: string,
  devGuildId?: string,
): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(token);
  return new Promise<void>((res, rej) => {
    client.once("ready", (client) => {
      // Tells discord what server to test on
      let endpoint;
      if (devGuildId) {
        //Prepares for use on test server
        endpoint = Routes.applicationGuildCommands(client.application.id, devGuildId)
      } else {
        //Prepares for global use on any server
        endpoint = Routes.applicationCommands(client.application.id)
      }

      rest.put(
        endpoint,
        { body: Object.values(commands).map((command) => command.toJSON()) },
      ).catch(rej).then(() => client.destroy().catch(rej).then(res));
    });

    client.login(token).catch(rej);
  });
}

export async function startBot(token: string) {
  client.on("ready", async (client) => {
    const disallowed: EventRecord[] = []

    for (const _guild of client.guilds.cache.values()) {
      const guild = _guild as Guild;
      const currentState = await getCurrentState(guild.id);
      // TODO(dylhack): make this fetch in batches to avoid 1k limit
      const members = await guild.members.fetch();

      currentState.forEach(state => {
        const discordId = state.users.discord_id;

        if (!members.has(discordId)) {
          disallowed.push({
            user_id: state.users.id,
            guild_id: guild.id,
          });
        }
      });
    };

    if (disallowed.length > 0) {
      await disallowAll(disallowed);
    }
    console.log("Sync complete, bot is ready.");
  });

  client.on("guildMemberRemove", async (member) => {
    const guildId = member.guild.id;
    const user = await getUserByDiscordId(member.id);

    if(!user) {
      console.log("User does not exist penis balls funny");
    } else {
      await disallow(guildId, user.id);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const handler = commands[interaction.commandName];
    if (!handler) {
      await interaction.reply("fuick youi.");
      return;
    }

    await handler.execute(interaction);
  });

  await client.login(token);
}