import { Client, REST, Routes } from "discord.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

/**
 * Registering bot online one time, never again
 */
export function registerCommands(
  token: string,
  devGuildId?: string,
): Promise<void> {
  const client = new Client({ intents: [] });
  const rest = new REST({ version: "10" }).setToken(token);
  return new Promise<void>((res, rej) => {
    client.once("ready", (client) => {
      //Tells discord what server to test on
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
        { body: commands },
      ).catch(rej).then(() => client.destroy().catch(rej).then(res));
    });

    client.login(token).catch(rej);
  });
}
