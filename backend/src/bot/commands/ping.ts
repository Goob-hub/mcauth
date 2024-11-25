import { type ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import Command from '../command.ts';

export default class PingCommand extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Will prompt user with link to microsoft for the 3 numbers on the back of their credit card")
    );
  }

  override async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply("Give me your credit card details");
  }
}

