import { ContextMenuInteraction, CacheType } from "discord.js";
import { bankerRoleId, bankTransactionsChannelId } from "../../config";
import { ContextMenuCommand } from "../../shared/command/context-menu-command";
import {
  getTextChannel,
  requireInteractionMemberRole,
} from "../../shared/command/util";

class DroppedSpellLow extends ContextMenuCommand {
  public async execute(
    interaction: ContextMenuInteraction<CacheType>
  ): Promise<void> {
    if (!interaction.isMessageContextMenu()) {
      throw new Error(`${this.name} can only be used on messages.`);
    }

    requireInteractionMemberRole(bankerRoleId, interaction);

    const bankRequest = interaction.targetMessage;

    const channel = await getTextChannel(
      bankTransactionsChannelId,
      interaction
    );

    const bankTransaction = channel.send({
      content: `Type: ${this.name}
Who: ${bankRequest.author}
Cost: 50p
${bankRequest.content
  .split("\n")
  .map((l) => `> ${l}`)
  .join("\n")}`,
    });

    await interaction.editReply(`Created bank transaction ${bankTransaction}`);
  }
}

export const droppedSpellLowContextMenuCommand = new DroppedSpellLow(
  "Low Dropped Spell"
);
