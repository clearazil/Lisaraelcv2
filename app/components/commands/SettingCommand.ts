import Command from '@components/Command';
import {DateTime} from 'luxon';
import type CommandInterface from '../interfaces/CommandInterface';
import Helper from '@components/Helper';
import User from '@database/models/User';
import Guild from '@database/models/Guild';
import type TimeZoneData from '@components/types/TimeZoneData';
import UserSetting from '@database/models/UserSetting';

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
        const timeZoneData = this.interpolateTimeZoneFromInput(timeZone);

        if (timeZoneData === undefined) {
            await this.interaction.reply({
                content: `Sorry, the time zone ${timeZone} is invalid.\n\nSee this link for a list of valid timezones:\n<https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a>`,
                ephemeral: this.command.ephemeral,
            });

            return;
        }

        if (!await this.saveTimeZoneSetting(timeZoneData)) {
            await this.interaction.reply({
                content: 'Something went wrong setting your time zone.',
                ephemeral: false,
            });
        }

        await this.interaction.reply({
            content: `Your time zone has been set! Your local time is: ${timeZoneData.dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}`,
            ephemeral: this.command.ephemeral,
        });
    }

    public interpolateTimeZoneFromInput(timeZone: string): TimeZoneData | undefined {
        timeZone = timeZone.replace(' ', '_');

        let timeZoneDifference = '';
        let timeZoneOffset = '';

        const regExp = new RegExp(/([a-z/_]*-?(?=[a-z])[a-z]*)([/+-])?(\d{1,2})?/, 'i');
        const found = regExp.exec(timeZone);

        let dateTime: DateTime | undefined;

        if (found !== null) {
            dateTime = Helper.dateTimeFromTimeZone(found[1], found[2], Number(found[3]));
            timeZone = found[1];

            if (found[3] !== undefined && found[3].length > 0) {
                timeZoneDifference = found[2];
                timeZoneOffset = found[3];
            }
        }

        if (found === null || dateTime === undefined || !dateTime.isValid) {
            return undefined;
        }

        return {dateTime, timeZone, timeZoneDifference, timeZoneOffset};
    }

    public async saveTimeZoneSetting(timeZoneData: TimeZoneData) {
        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return false;
        }

        let user = await User.findOne({
            where: {
                discordUserId: this.interaction.user.id,
                guildId: guild.id,
            },
            include: UserSetting,
        });

        if (user === null) {
            user = await User.create({
                discordUserId: this.interaction.user.id,
                name: this.interaction.user.username,
                guildId: guild.id,
            });
        }

        if (user.UserSetting !== null) {
            user.UserSetting.timeZone = timeZoneData.timeZone;
            user.UserSetting.timeZoneDifference = timeZoneData.timeZoneDifference;
            user.UserSetting.timeZoneOffset = timeZoneData.timeZoneOffset;
            await user.UserSetting.save();

            return true;
        }

        await UserSetting.create({
            userId: user.id,
            timeZone: timeZoneData.timeZone,
            timeZoneDifference: timeZoneData.timeZoneDifference,
            timeZoneOffset: timeZoneData.timeZoneOffset,
        });

        return true;
    }
}
