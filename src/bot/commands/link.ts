import { type ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../command.ts';
import * as jose from 'https://deno.land/x/jose@v5.9.6/index.ts'
import { JWT_OPTIONS } from "../../constants.ts";

export default class LinkCommand extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
      .setName("link")
      .setDescription("Will prompt user with link to microsoft for the 3 numbers on the back of their credit card")
    );
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const jwt = await new jose.SignJWT({ discord_id: interaction.user.id, guild_id: interaction.guildId })
      .setProtectedHeader({ alg: JWT_OPTIONS.alg })
      .setIssuedAt()
      .setExpirationTime('30m')
      .sign(JWT_OPTIONS.key);
    
    await interaction.reply({ content: `https://mcauth.dev/link?token=${jwt}`, ephemeral: true });
  }
}
