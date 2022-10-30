import {DateTime} from 'luxon';

/**
 *
 */
class Helper {
    dateTimeFromTimeZone(timeZone: string, difference: string, offset: number | undefined): DateTime {
        let dateTime = DateTime.local().setZone(timeZone);

        if (offset !== undefined) {
            if (difference === '+') {
                dateTime = dateTime.plus({hours: offset});
            }

            if (difference === '-') {
                dateTime = dateTime.minus({hours: offset});
            }
        }

        return dateTime;
    }
}

export default new Helper();
