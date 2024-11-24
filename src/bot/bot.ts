import { Client } from "discord.js";

const client = new Client({ intents: ["GuildMembers"] });

client.on("ready", (client) => {
  
});

export async function startBot() {
  await client.login();
}