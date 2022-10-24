import Command from '@components/Command';
import {DateTime} from 'luxon';
import type CommandInterface from '../interfaces/CommandInterface';
import TimeZoneSetter from './time-zone/TimeZoneSetter';

export default class SettingCommand extends Command implements CommandInterface {
    public run() {
        if (this.interaction.commandName === null) {
            return;
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
