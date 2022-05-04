import { SlashCommand } from "../../shared/command/slash-command";
import { addSubcommand } from "./add-subcommand";
import { removeSubcommand } from "./remove-subcommand";

export const bankHourCommand = new SlashCommand(
  "bankhour",
  "Set or remove bank hours.",
  [addSubcommand, removeSubcommand]
);
