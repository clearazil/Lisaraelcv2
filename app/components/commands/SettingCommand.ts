import Command from '@components/Command';
import {DateTime} from 'luxon';
import type CommandInterface from '../interfaces/CommandInterface';
import TimeZoneSetter from './time-zone/TimeZoneSetter';
import Guild from '@database/models/Guild';
import UserSetting from '@database/models/UserSetting';

export default class SettingCommand extends Command implements CommandInterface {
    public run() {
        if (this.interaction.commandName === null) {
            return;
        }

        if (this.interaction.commandName === 'notify-for-all-games') {
            console.log('Running notify-for-all-games command...');
            void this.notifyForAllGames();
        }

        if (this.interaction.commandName === 'time-zone') {
            const timeZone = this.interaction.options.getString('time-zone');

            if (timeZone === null) {
                return;
            }

            console.log('Running time-zone command...');
            void this.setUserTimeZone(timeZone);
        }
    }

    public hasPermissions() {
        return true;
    }

    public async notifyForAllGames() {
        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return;
        }

        const user = await guild.getGuildUser(
            this.interaction.user.id,
            this.interaction.user.username,
            UserSetting,
        );

        let response = 'Notifications for all games have been turned on. Use /ignore-games to set exceptions.';

        if (user.UserSetting === null) {
            await UserSetting.create({
                userId: user.id,
                notifyAllGames: true,
            });
        } else {
            if (user.UserSetting.notifyAllGames) {
                user.UserSetting.notifyAllGames = false;
                response = 'Notifications for all games have been turned off. Use /games to set notifications for specific games.';
            } else {
                user.UserSetting.notifyAllGames = true;
            }

            await user.UserSetting.save();
        }

        await this.interaction.reply({content: response, ephemeral: this.command.ephemeral});
    }

    public async setUserTimeZone(timeZone: string) {
        const setter = new TimeZoneSetter(timeZone);

        if (setter.timeZoneData === undefined) {
            await this.interaction.reply({
                content: `Sorry, the time zone ${timeZone} is invalid.\n\nSee this link for a list of valid timezones:\n<https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a>`,
                ephemeral: this.command.ephemeral,
            });

            return;
        }

        const success = await setter.saveToDatabase({
            discordUserId: this.interaction.user.id,
            discordGuildId: this.interaction.guildId ?? undefined,
            username: this.interaction.user.username,
        });

        if (!success) {
            await this.interaction.reply({
                content: 'Something went wrong setting your time zone.',
                ephemeral: false,
            });

            return;
        }

        await this.interaction.reply({
            content: `Your time zone has been set! Your local time is: ${setter.timeZoneData.dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}`,
            ephemeral: this.command.ephemeral,
        });
    }
}
