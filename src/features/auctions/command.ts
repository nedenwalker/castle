import { SlashCommand } from "../../shared/command/slash-command";
import { itemSubcommand } from "./item-subcommand";
import { spellSubcommand } from "./spell-subcommand";

export const auctionCommand = new SlashCommand(
  "auction",
  "Start a new auction.",
  [spellSubcommand, itemSubcommand]
);
