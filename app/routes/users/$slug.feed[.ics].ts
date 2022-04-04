import { LoaderFunction } from "custom.env";
import { Frequency } from "~/types.server";

export const loader: LoaderFunction<string> = async ({ params, request, context }) => {
    const groups = await context.model.findGroupsForFeed(params.slug!);
    const query = new URL(request.url).searchParams;

    const ics = renderIcs(groups.flatMap(g =>
        g.friends.map((f): Checkin => ({
            friendName: f.name,
            freq: g.freq,
            addedAt: f.createdAt,
        }))
    ));

    return new Response(ics, {
        status: 200,
        headers: {
            'Content-type': query.has('raw') ? 'text/plain' : 'text/calendar',
        }
    })
};

interface Checkin {
    friendName: string;
    freq: Frequency;
    addedAt: Date;
}

const renderIcs = (checkins: Array<Checkin>): string => {
    const HEAD = `BEGIN:VCALENDAR
VERSION:2.0`;

    const vEvents: string = checkins.map((ch): string => {
        const date = formatDate(ch.freq == 'Daily'
            ? ch.addedAt
            : offsetDayNextWeek(ch.addedAt, 1, 9), 'YYYYMMDD');

        return (
            `BEGIN:VEVENT
CLASS:PUBLIC
SUMMARY:Check in with ${ch.friendName}
DESCRIPTION:Happens ${ch.freq.toLowerCase()}.
TRANSP:TRANSPARENT
RRULE:${icsFreqOf(ch.freq)}
DTSTART:${date}
DTEND:${date}
END:VEVENT`
        );
    }).join('\n');


    const FOOT = `END:VCALENDAR
UID:${uid()}
DTSTAMP:${formatDate(new Date(), 'YYYYMMDD')}
PRODID:checkins`;

    return (
        `${HEAD}
${vEvents}
${FOOT}`);

};

type ICSFreq = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

const icsFreqOf = (freq: Frequency): `FREQ=${ICSFreq};INTERVAL=${number}` => {
    switch (freq) {
        case 'Daily':
            return `FREQ=DAILY;INTERVAL=1`;
        case 'Weekly':
            return `FREQ=WEEKLY;INTERVAL=1`;
        case 'Monthly':
            return `FREQ=MONTHLY;INTERVAL=1`;
        case 'Yearly':
            return `FREQ=YEARLY;INTERVAL=1`;
        case 'HalfYearly':
            return `FREQ=MONTHLY;INTERVAL=6`;
    }
}

// From https://github.com/jshor/datebook (MIT)
const uid = (): string => Math.random().toString(36).substring(2);

// From https://github.com/jshor/datebook (MIT)
/**
 * Formats the given JS Date() object to the given format.
 */
const formatDate = (d: Date, format: string): string => {
    const dateValues: Record<string, string | number> = {
        YYYY: d.getUTCFullYear(),
        MM: addLeadingZero(d.getUTCMonth() + 1),
        DD: addLeadingZero(d.getUTCDate()),
        hh: addLeadingZero(d.getUTCHours()),
        mm: addLeadingZero(d.getUTCMinutes()),
        ss: addLeadingZero(d.getUTCSeconds())
    };

    return Object
        .keys(dateValues)
        .reduce((date: string, key: string): string =>
            date.replace(key, dateValues[key].toString())
            , format);
}

// From https://github.com/jshor/datebook (MIT)
/**
 * Adds a leading zero to a single-digit string and returns a two-digit string.
 */
const addLeadingZero = (n: number | string = ''): string =>
    `0${parseInt(n.toString(), 10)}`.slice(-2);

/** Returns a Date for the first day of next week after the provided Date.
 *
 * * Day parameter will set it to the (zero indexed) day of next week. 0 = Sunday,
 * 1 = Monday, etc.
 * * Hour parameter will set the local hour in the day for the returned date.
 */
const offsetDayNextWeek = (provided: Date, day: number, hour: number): Date => {
    const ret = new Date(provided);
    ret.setHours(hour);
    // + 7 is for "next week".
    ret.setDate(ret.getDate() - ret.getDay() + 7 + day);

    return ret;
}
