import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { CacheType, ContextMenuInteraction } from "discord.js";

export abstract class ContextMenuCommand {
  public readonly command: ContextMenuCommandBuilder;

  public constructor(public readonly name: string) {
    this.command = new ContextMenuCommandBuilder().setName(name).setType(3); // MESSAGE type
  }

  public abstract execute(
    interaction: ContextMenuInteraction<CacheType>
  ): Promise<void>;
}
