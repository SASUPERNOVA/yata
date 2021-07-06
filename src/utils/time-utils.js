const TimeType = Object.freeze({
    YEAR: 0,
    MONTH: 1,
    DAY: 2,
    HOUR: 3,
    MINUTE: 4,
    SECOND: 5
});

function padNum(num) {
    return num.toString().padStart(2, '0');
}

function toMilliseconds(time, timeType) {
    switch (timeType) {
        case TimeType.YEAR:
            return time * 31557600000;
        case TimeType.MONTH:
            return time * 2629800000;
        case TimeType.DAY:
            return time * 86400000;
        case TimeType.HOUR:
            return time * 3600000;
        case TimeType.MINUTE:
            return time * 60000;
        case TimeType.SECOND:
            return time * 1000;
        default:
            return NaN;
    }
}

function addTime(date, { years, months, days, hours, minutes, seconds, milliseconds }) {
    let extraTime = 0;
    extraTime += years ? toMilliseconds(years, TimeType.YEAR) : 0;
    extraTime += months ? toMilliseconds(months, TimeType.MONTH) : 0;
    extraTime += days ? toMilliseconds(days, TimeType.DAY) : 0;
    extraTime += hours ? toMilliseconds(hours, TimeType.HOUR) : 0;
    extraTime += minutes ? toMilliseconds(minutes, TimeType.MINUTE) : 0;
    extraTime += seconds ? toMilliseconds(seconds, TimeType.SECOND) : 0;
    extraTime += milliseconds ? milliseconds : 0;
    return  new Date(date.getTime() + extraTime);
}

function subtractTime(date, { years, months, days, hours, minutes, seconds, milliseconds }) {
    let extraTime = 0;
    extraTime += years ? toMilliseconds(years, TimeType.YEAR) : 0;
    extraTime += months ? toMilliseconds(months, TimeType.MONTH) : 0;
    extraTime += days ? toMilliseconds(days, TimeType.DAY) : 0;
    extraTime += hours ? toMilliseconds(hours, TimeType.HOUR) : 0;
    extraTime += minutes ? toMilliseconds(minutes, TimeType.MINUTE) : 0;
    extraTime += seconds ? toMilliseconds(seconds, TimeType.SECOND) : 0;
    extraTime += milliseconds ? milliseconds : 0;
    return  new Date(date.getTime() - extraTime);
}

function getFullDate(date) {
    return `${date.getFullYear()}-${padNum(date.getMonth()+1)}-${padNum(date.getDate())}`;
}

function getFullTime(date) {
    return `${padNum(date.getHours())}:${padNum(date.getMinutes())}:${padNum(date.getSeconds())}.${padNum(date.getMilliseconds())}`;
}

function dateFromTime({ hours, minutes, seconds, milliseconds }) {
    let date = new Date();
    date.setHours(hours ? hours : 0, minutes ? minutes : 0, seconds ? seconds : 0, milliseconds ? milliseconds : 0);

    return date;
}

function toNativeTime(date) {
    date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return`${date.toISOString().slice(0, -1)}`;
}