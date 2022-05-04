import {
  CacheType,
  GuildMemberRoleManager,
  Interaction,
  PermissionResolvable,
} from "discord.js";

export const requireInteractionMemberRole = (
  roleId: string,
  interaction: Interaction<CacheType>
) => {
  const roles = interaction.member?.roles as GuildMemberRoleManager;
  if (!roles) {
    throw new Error("Could not determine your roles.");
  }
  if (!roles.cache.get(roleId)) {
    throw new Error(`Must have <@&${roleId}> role to use this command.`);
  }
};

export const requireInteractionMemberPermission = (
  permission: PermissionResolvable,
  interaction: Interaction<CacheType>
) => {
  if (!interaction.memberPermissions?.has(permission)) {
    throw new Error("You do not have permission to do this.");
  }
};

export const getChannel = async (
  channelId: string,
  interaction: Interaction<CacheType>
) => {
  return await interaction.guild?.channels.fetch(channelId);
};

export const getTextChannel = async (
  channelId: string,
  interaction: Interaction<CacheType>
) => {
  const channel = await getChannel(channelId, interaction);
  if (!channel?.isText()) {
    throw new Error(`${channelId} is not a text channel.`);
  }
  return channel;
};

export const getRole = (
  roleId: string,
  interaction: Interaction<CacheType>
) => {
  return interaction.guild?.roles.cache.get(roleId);
};

export const requireUserRole = (
  userId: string,
  roleId: string,
  interaction: Interaction<CacheType>
) => {
  const role = getRole(roleId, interaction);
  if (!role?.members.get(userId)) {
    throw new Error(`<@${userId}> is not a ${role}.`);
  }
};
