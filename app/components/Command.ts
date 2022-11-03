import type {ChatInputCommandInteraction, GuildMember, InteractionReplyOptions, Message} from 'discord.js';
import {PermissionFlagsBits} from 'discord.js';
import type {default as CommandType} from './types/Command';

export default class Command {
    protected interaction: ChatInputCommandInteraction;
    protected command: CommandType;

    constructor(interaction: ChatInputCommandInteraction, command: CommandType) {
        this.interaction = interaction;
        this.command = command;
    }

    public async hasPermissions(): Promise<boolean> {
        if (this.command.requiredBotPermissions === undefined) {
            return true;
        }

        const bot = this.interaction.guild?.members.me;

        if (bot === undefined || bot === null) {
            return false;
        }

        let noPermissionMessage = 'Cannot run command, I am missing the following permission: ';

        let reply: InteractionReplyOptions | undefined;
        let hasPermission = true;

        for (const [permission, permissionName] of this.command.requiredBotPermissions) {
            if (permission === PermissionFlagsBits.SendMessages) {
                if (!this.hasPermissionInChannel(bot, permission)) {
                    reply = {
                        content: 'Cannot run command, I don\'t have permission to post messages in this channel.',
                        ephemeral: true,
                    };

                    hasPermission = false;
                }
            }

            if (permission === PermissionFlagsBits.SendMessagesInThreads && this.interaction.channel?.isThread()) {
                if (!this.hasPermissionInChannel(bot, permission)) {
                    reply = {
                        content: 'Cannot run command, I don\'t have permission to post messages in this thread.',
                        ephemeral: true,
                    };

                    hasPermission = false;
                }
            }

            if (!bot.permissions.has(permission)) {
                noPermissionMessage += `${permissionName}.`;
                hasPermission = false;

                reply = {content: noPermissionMessage};
            }
        }

        if (reply !== undefined) {
            await this.interaction.reply(reply);
        }

        return hasPermission;
    }

    private hasPermissionInChannel(bot: GuildMember, permission: bigint): boolean {
        const {channel} = this.interaction;

        if (channel === null) {
            return false;
        }

        return bot.permissionsIn(channel.id).has(permission);
    }
}
