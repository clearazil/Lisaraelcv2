import TimeZoneSetter from '@components/commands/time-zone/TimeZoneSetter';
import {jest, test, expect} from '@jest/globals';

test('Returns time zone data', () => {
    const setter = new TimeZoneSetter('CET');

    expect(setter.timeZoneData).toBeDefined();
    expect(setter.timeZoneData?.timeZone).toBe('CET');
    expect(setter.timeZoneData?.timeZoneDifference).toBe('');
    expect(setter.timeZoneData?.timeZoneOffset).toBe('');
});

test('Does not return time zone data', () => {
    const setter = new TimeZoneSetter('Garble');

    expect(setter.timeZoneData).toBeUndefined();
});

test('Time zone offset is set with +', () => {
    const setter = new TimeZoneSetter('CET+1');

    expect(setter.timeZoneData?.timeZoneDifference).toBe('+');
    expect(setter.timeZoneData?.timeZoneOffset).toBe('1');
});

test('Time zone offset is set with -', () => {
    const setter = new TimeZoneSetter('EST-2');

    expect(setter.timeZoneData?.timeZoneDifference).toBe('-');
    expect(setter.timeZoneData?.timeZoneOffset).toBe('2');
});

