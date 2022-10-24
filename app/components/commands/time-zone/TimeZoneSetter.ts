import type {DateTime} from 'luxon';
import type TimeZoneData from '@components/types/TimeZoneData';
import Helper from '@components/Helper';
import User from '@database/models/User';
import Guild from '@database/models/Guild';
import UserSetting from '@database/models/UserSetting';

export default class TimeZoneSetter {
    timeZoneData: TimeZoneData | undefined;

    constructor(timeZone: string) {
        this.timeZoneData = this.interpolateFromInput(timeZone);
    }

    public async saveToDatabase(userData: {discordGuildId: string | undefined; discordUserId: string; username: string}): Promise<boolean> {
        if (this.timeZoneData === undefined) {
            return false;
        }

        const guild = await Guild.findOne({
            where: {
                discordGuildId: userData.discordGuildId,
            },
        });

        if (guild === null) {
            return false;
        }

        let user = await User.findOne({
            where: {
                discordUserId: userData.discordUserId,
                guildId: guild.id,
            },
            include: UserSetting,
        });

        if (user === null) {
            user = await User.create({
                discordUserId: userData.discordUserId,
                name: userData.username,
                guildId: guild.id,
            });
        }

        if (user.UserSetting !== null) {
            user.UserSetting.timeZone = this.timeZoneData.timeZone;
            user.UserSetting.timeZoneDifference = this.timeZoneData.timeZoneDifference;
            user.UserSetting.timeZoneOffset = this.timeZoneData.timeZoneOffset;
            await user.UserSetting.save();

            return true;
        }

        await UserSetting.create({
            userId: user.id,
            timeZone: this.timeZoneData.timeZone,
            timeZoneDifference: this.timeZoneData.timeZoneDifference,
            timeZoneOffset: this.timeZoneData.timeZoneOffset,
        });

        return true;
    }

    private interpolateFromInput(timeZone: string): TimeZoneData | undefined {
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
}
