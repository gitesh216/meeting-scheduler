import { DateTime, Interval } from "luxon";

export interface TimeWindow {
    start: DateTime;
    end: DateTime;
}

/**
 * Given the time and date, return absolute DateTime object in Host's timezone
 */
export function parseTimeOnDate(
    date: DateTime,
    time: string,
    timezone: string,
) {
    const [hour, minute] = time.split(":").map(Number);

    return date
        .setZone(timezone)
        .set({ hour, minute, second: 0, millisecond: 0 });
}

/**
 * Combine the overlapping intervals into a single interval
 * [ {09:00, 12:00} , { 11:00, 14:00 } ] => [ {09:00, 14:00} ]
 */
export function mergeWindows(windows: TimeWindow[]): TimeWindow[] {
    if (windows.length === 0) {
        return [];
    }

    const sortedWindows = [...windows].sort(
        (a, b) => a.start.toMillis() - b.start.toMillis(),
    );

    const mergedWindows: TimeWindow[] = [sortedWindows[0]];

    for (let i = 1; i < sortedWindows.length; i++) {
        const currentWindow = sortedWindows[i];
        const lastMergedWindow = mergedWindows[mergedWindows.length - 1];

        if (currentWindow.start <= lastMergedWindow.end) {
            lastMergedWindow.end =
                currentWindow.end > lastMergedWindow.end
                    ? currentWindow.end
                    : lastMergedWindow.end;
        } else {
            mergedWindows.push(currentWindow);
        }
    }
    return mergedWindows;
}

export function splitIntoSlots(
    windows: TimeWindow[],
    durationMinutes: number,
    bufferBeforeMinutes: number,
    bufferAfterMinutes: number,
): TimeWindow[] {
    const slots: TimeWindow[] = [];

    const totalMinutes =
        durationMinutes + bufferBeforeMinutes + bufferAfterMinutes;

    for (const window of windows) {
        let cursor = window.start;

        while (cursor.plus({ minutes: totalMinutes }) <= window.end) {
            const slotStart = cursor.plus({ minutes: bufferBeforeMinutes });
            const slotEnd = slotStart.plus({ minutes: durationMinutes });

            slots.push({ start: slotStart, end: slotEnd });

            cursor = cursor.plus({ minutes: durationMinutes });
        }
    }
    return slots;
}

export function subtractWindows(
    windows: TimeWindow[],
    block: TimeWindow,
): TimeWindow[] {
    const result: TimeWindow[] = [];

    for (const window of windows) {
        const interval = Interval.fromDateTimes(window.start, window.end);
        const blockInterval = Interval.fromDateTimes(block.start, block.end);

        if (!interval.overlaps(blockInterval)) {
            result.push(window);
        }

        if (block.start > window.start) {
            result.push({ start: window.start, end: block.start });
        }

        if (block.end < window.end) {
            result.push({ start: block.end, end: window.end });
        }
    }
    return result.filter((w) => w.end > w.start);
}

export function overlapsBooked(
    slot: TimeWindow,
    booked: TimeWindow[],
    bufferBeforeMinutes: number,
    bufferAfterMinutesL: number,
): boolean {
    const paddedStart = slot.start.minus({ minutes: bufferBeforeMinutes });
    const paddedEnd = slot.end.plus({ minutes: bufferAfterMinutesL });

    return booked.some((b) => {
        const interval = Interval.fromDateTimes(paddedStart, paddedEnd);
        const bookedInterval = Interval.fromDateTimes(b.start, b.end);
        return interval.overlaps(bookedInterval);
    });
}

export function applyExceptionsForDate(
    date: DateTime,
    baseWindows: TimeWindow[],
    exceptions: Array<{
        type: string;
        startTime: string | null;
        endTime: string | null;
        timeZone: string;
    }>,
): TimeWindow[] {
    let windows = [...baseWindows];

    for (const ex of exceptions) {
        if (ex.type === "BLOCK_FULL_DAY") {
            return [];
        }

        if (ex.type === "BLOCK_PARTIAL" && ex.startTime && ex.endTime) {
            const block = {
                start: parseTimeOnDate(date, ex.startTime, ex.timeZone),
                end: parseTimeOnDate(date, ex.endTime, ex.timeZone),
            };
            windows = subtractWindows(windows, block);
        }

        if (ex.type === "ADD_AVAILABLE_WINDOW" && ex.startTime && ex.endTime) {
            const window = {
                start: parseTimeOnDate(date, ex.startTime, ex.timeZone),
                end: parseTimeOnDate(date, ex.endTime, ex.timeZone),
            };
            windows.push(window);
        }
    }

    return mergeWindows(windows);
}

export function windowsForWeekDayRul(
    date: DateTime,
    weekday: number,
    startTime: string,
    endTime: string,
    timeZone: string,
): TimeWindow[] {
    const localDate = date.setZone(timeZone).startOf("day");
    const luxonWeekDay = weekday === 0 ? 7 : weekday;

    if (localDate.weekday !== luxonWeekDay) {
        return [];
    }

    const start = parseTimeOnDate(localDate, startTime, timeZone);
    const end = parseTimeOnDate(localDate, endTime, timeZone);

    if (!start.isValid || !end.isValid || start >= end) {
        return [];
    }

    return [{ start, end }];
}
