import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  ContextMenuInteraction,
} from "discord.js";
import { clientId, environment, guildId, token } from "../config";
import { auctionCommand } from "../features/auctions/command";
import { bankHourCommand } from "../features/bank-hours/command";
import { bankingButtonCommand } from "../features/bank-request-info/bankingButtonCommand";
import { droppedSpellLowContextMenuCommand } from "../features/bank-request-info/dropped-spell-low";
import { cleanupInvitesCommand } from "../features/invite-list/cleanup-invites-command";
import { inviteCommand } from "../features/invite-list/command";
import { friendConfigButtonCommand } from "../features/invite-list/friend-config-button";
import { requestGuardApplicationCommand } from "../features/invite-list/request-guard-application-command";
import { whoButtonCommand } from "../features/invite-list/who-button-command";

const slashCommands = [bankHourCommand, auctionCommand, inviteCommand];

const buttonCommands = [
  bankingButtonCommand,
  cleanupInvitesCommand,
  whoButtonCommand,
  friendConfigButtonCommand,
  requestGuardApplicationCommand,
];

const contextMenuCommands = [droppedSpellLowContextMenuCommand];

export const getCommand = (
  interaction:
    | CommandInteraction<CacheType>
    | AutocompleteInteraction<CacheType>
) => {
  const command = slashCommands.find((c) => c.name === interaction.commandName);
  if (!command) {
    throw new Error(
      `Could not find slash command **/${interaction.commandName}**`
    );
  }
  return command;
};

export const getButton = (interaction: ButtonInteraction<CacheType>) => {
  const command = buttonCommands.find(
    (c) => c.customId === interaction.customId
  );
  if (!command) {
    throw new Error(
      `Could not find button command **${interaction.customId}**`
    );
  }
  return command;
};

export const getContextMenu = (
  interaction: ContextMenuInteraction<CacheType>
) => {
  const command = contextMenuCommands.find(
    (c) => c.name === interaction.commandName
  );
  if (!command) {
    throw new Error(
      `Could not find context menu command **${interaction.commandName}**`
    );
  }
  return command;
};

export const registerSlashCommands = () => {
  const rest = new REST({ version: "9" }).setToken(token);
  const route =
    environment === "local"
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);
  rest
    .put(route, {
      body: [...slashCommands, ...contextMenuCommands].map((c) =>
        c.command.toJSON()
      ),
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
};
