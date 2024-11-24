import { type ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";

export default abstract class Command {
  constructor(private readonly builder: SlashCommandBuilder) {
  }

  abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;

  toJSON() {
    return this.builder.toJSON();
  }
}