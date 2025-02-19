import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Permissions,
  User,
} from "discord.js";
import {
  garrisonRoleId,
  gatehouseChannelId,
  greenRoleId,
  inviteListChannelId,
  raiderEnlistmentChannelId,
  rolesChannelId,
} from "../../config";
import {
  ReactionAction,
  reactionActionExecutor,
} from "../../shared/action/reaction-action";
import { actionConfigByReaction, Emoji, ActionType } from "./config";

export const tryGatehouseReactionAction = (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => reactionActionExecutor(new GatehouseReactionAction(reaction, user));

class GatehouseReactionAction extends ReactionAction {
  public async execute() {
    // filter channel
    if (this.message.channel.id !== gatehouseChannelId) {
      return;
    }
    // authorize user
    const reactor = await this.members?.fetch(this.user.id);
    if (!reactor?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return;
    }

    // todo: refactor to not use a switch
    switch (this.action) {
      case ActionType.Tag:
        await this.tag();
        return;
      case ActionType.Interview:
        await this.interview();
        return;
      case ActionType.Instruct:
        await this.instruct();
        return;
    }
  }

  private async tag() {
    // apply roles
    if (!this.roleIds) {
      return;
    }
    const author = await this.members?.fetch(this.authorId);
    if (!author) {
      throw new Error("Something went wrong retrieving the message author.");
    }

    author.roles.add(this.roleIds);
    const green = this.roleIds.includes(greenRoleId);
    const garrison = this.roleIds.includes(garrisonRoleId);

    // send welcome message
    let welcome = `Welcome to the Garrison, ${author}! Check out these channels:`;
    if (green && garrison) {
      welcome += `\n• Visit <#${inviteListChannelId}> (hit the "add self to invite list" button)`;
    }
    welcome += `\n• Visit <#${rolesChannelId}> (set your class)`;
    if (green) {
      welcome += `\n• Visit <#${raiderEnlistmentChannelId}> (join the raid force)`;
    }
    this.message.channel.send(welcome);
  }

  private async interview() {
    await this.message
      .reply(`Do you agree to these rules? If so, the next available officer will give you Discord tags.

**Castle Rules**:
(1) no real-life politics or contentious real-life issues in guild chat
(2) no real-life slurs in guild chat
(3) no fights or freakouts in guild chat - use /tells or talk to an officer
(4) follow all Project 1999 rules such as no RMT or multi-boxing
(5) don't be a jerk.`);
  }

  private async instruct() {
    await this.message.reply(
      `Perform the [following 3 steps]:
1. Set your nickname to your in-game name (right-click your own name to set it).
2. Tell us your server (Blue or Green)
3. Tell us your current guild (or none if you're joining)`
    );
  }

  private get emoji() {
    return this.reaction.emoji.name as Emoji;
  }

  private get action() {
    return this.actionConfig?.action;
  }

  private get roleIds() {
    return this.actionConfig?.roles;
  }

  private get actionConfig() {
    if (!this.emoji) {
      return;
    }
    if (!Object.values(Emoji).includes(this.emoji)) {
      return;
    }
    return actionConfigByReaction[this.emoji];
  }
}
