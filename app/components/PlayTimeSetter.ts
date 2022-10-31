import type {SelectMenuInteraction} from 'discord.js';
import {ActionRowBuilder} from '@discordjs/builders';
import {SelectMenuBuilder} from '@discordjs/builders';
import Guild from '@database/models/Guild';
import PlayTime from '@database/models/PlayTime';
import PlayTimeUser from '@database/models/PlayTimeUser';
import type {ChatInputCommandInteraction, InteractionUpdateOptions, InteractionReplyOptions} from 'discord.js';
import type User from '@database/models/User';

export default class PlayTimeSetter {
    public async getReplyOptions(interaction: ChatInputCommandInteraction): Promise<InteractionReplyOptions | undefined> {
        if (interaction.guildId === null) {
            return;
        }

        const guild = await this.getGuild(interaction.guildId);

        if (guild === undefined) {
            return;
        }

        const user = await this.getUser(guild, interaction);

        const options = this.selectOptions(guild.PlayTimes);

        if (options.length > 0) {
            const row = new ActionRowBuilder<SelectMenuBuilder>()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('set-play-times')
                        .setPlaceholder('Nothing selected')
                        .setMinValues(1)
                        .setMaxValues(options.length)
                        .addOptions(options),
                );

            return {content: this.replyContent(user.PlayTimes), components: [row]};
        }
    }

    public async getUpdateOptions(interaction: SelectMenuInteraction): Promise<InteractionUpdateOptions | undefined> {
        if (interaction.guildId === null) {
            return;
        }

        const guild = await this.getGuild(interaction.guildId);

        if (guild === undefined) {
            return;
        }

        await this.saveTimes(interaction, guild);
        const user = await this.getUser(guild, interaction);

        return {content: this.replyContent(user.PlayTimes)};
    }

    private async getGuild(discordGuildId: string): Promise<Guild | undefined> {
        const guild = await Guild.findOne({
            where: {
                discordGuildId,
            },
            include: PlayTime,
        });

        if (guild === null) {
            return undefined;
        }

        return guild;
    }

    private replyContent(playTimes: PlayTime[]): string {
        let replyContent = '**You will receive notifications at:**\n';

        if (playTimes.length > 0) {
            for (const playTime of playTimes) {
                replyContent += `> ${playTime.name.charAt(0).toUpperCase() + playTime.name.slice(1)}: `;
                replyContent += `from ${playTime.timeStart} to ${playTime.timeEnd}\n`;
            }
        } else {
            replyContent += 'Nothing set. You will not receive notifications.\n';
        }

        replyContent += '\nSelect the times you would like to receive notifications at. ';
        replyContent += 'Select the first option if you don\'t want to receive any notifications.';

        return replyContent;
    }

    private selectOptions(playTimes: PlayTime[]) {
        const options = [{
            label: 'None',
            description: 'Select this option to remove your play time settings',
            value: 'clear',
        }];

        for (const playTime of playTimes) {
            options.push({
                label: playTime.name.charAt(0).toUpperCase() + playTime.name.slice(1),
                description: `From ${playTime.timeStart} to ${playTime.timeEnd}`,
                value: String(playTime.id),
            });
        }

        return options;
    }

    private async saveTimes(interaction: SelectMenuInteraction, guild: Guild) {
        const user = await guild.getGuildUser(
            interaction.user.id,
            interaction.user.username,
            PlayTime,
        );

        await PlayTimeUser.destroy({
            where: {
                userId: user.id,
            },
        });

        const playTimeUserData = [];
        let clear = false;

        for (const value of interaction.values) {
            if (value === 'clear') {
                clear = true;
            } else {
                playTimeUserData.push({
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    PlayTimeId: value,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    UserId: user.id,
                });
            }
        }

        if (playTimeUserData.length > 0 && !clear) {
            await PlayTimeUser.bulkCreate(playTimeUserData);
        }
    }

    private async getUser(guild: Guild, interaction: ChatInputCommandInteraction | SelectMenuInteraction): Promise<User> {
        const user = await guild.getGuildUser(
            interaction.user.id,
            interaction.user.username,
            PlayTime,
        );

        return user;
    }
}
