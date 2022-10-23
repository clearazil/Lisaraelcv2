import type {DateTime} from 'luxon';

type TimeZoneData = {
    dateTime: DateTime;
    timeZone: string;
    timeZoneDifference: string;
    timeZoneOffset: string;
};
export default TimeZoneData;
