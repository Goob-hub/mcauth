import { type ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../command.ts';
import * as jose from 'https://deno.land/x/jose@v5.9.6/index.ts'
import { JWT_OPTIONS } from "../../constants.ts";

export default class SetupCommand extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
      .setName("setup")
      .setDescription("Setup MCAuth for this Guild.")
      .setDMPermission(false)
    );
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!this.hasAdminPermission(interaction)) {
      await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
      return;
    }

    await interaction.reply({ 
      content: `Please provide this to the plugin.\n\`\`\`\n${await this.getToken(interaction)}\n\`\`\``, 
      ephemeral: true 
    });
  }

  private hasAdminPermission(interaction: ChatInputCommandInteraction) {
    return interaction.memberPermissions?.has("Administrator")
  }

  private async getToken(interaction: ChatInputCommandInteraction): Promise<string> {
    return await new jose.SignJWT({ bearer: interaction.guildId })
      .setProtectedHeader({ alg: JWT_OPTIONS.alg })
      .setIssuedAt()
      .sign(JWT_OPTIONS.key);
  }
}
