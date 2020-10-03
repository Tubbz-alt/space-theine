import {DateTime, Duration} from 'luxon';

/* PUBLIC AND PRIVATE CONSTS */

/**
 * We don't use words East/West in variable names, we just focus on numeric change
 */
const maximumDailyTimeShiftPositive: number = 1; // negative number = travel west
const maximumDailyTimeShiftNegative: number = 1.5; // positive number = travel east

/* PUBLIC AND PRIVATE TYPES */

export type SimpleTime = { // @TODO: library?
  hours: number,
  minutes: number,
}

// @TODO: export interface to separate file to make collaboration easier
export type Params = {
  startAt?: DateTime,
  timeZoneDifference: number, // => Duration?
  normalSleepingHoursStart: SimpleTime,
  normalSleepingHoursDuration: Duration,
}

export type Activity = {
  startTime: DateTime,
  duration: Duration,
  type: 'sleep', // @TODO: add more types
}

export type Result = {
  activities: Array<Activity>,
}

/* PRIVATE FUNCTIONS */

const getCurrentPossibleTimeShift = (params: Params) => {
  return isTimeshiftPositive(params) ?
    maximumDailyTimeShiftNegative : maximumDailyTimeShiftPositive;
};

/**
 * In other words: Is timeshift westward
 */
const isTimeshiftPositive = (params: Params) => {
  return params.timeZoneDifference > 0;
};

/* PUBLIC FUNCTIONS */

export const calculate = (params: Params): Result => {
  const timeshiftDirectionPositive = isTimeshiftPositive(params); // I know...
  const currentDailyTimeShift = getCurrentPossibleTimeShift(params);

  let startAt = params.startAt;
  if (startAt === undefined) {
    startAt = DateTime.local();
  }
  let activities = <Activity[]>[]; // just like: let activities: Activity[] = [];

  let timeshiftLeft = Math.abs(params.timeZoneDifference);
  // let lastActivityTime: DateTime|null = null;
  while (timeshiftLeft > 0) {
    let activityStartTime = DateTime.fromObject({
      ...startAt.toObject(),
      hour: params.normalSleepingHoursStart.hours,
      minute: params.normalSleepingHoursStart.minutes,
      second: 0,
      millisecond: 0,
    });
    let activity: Activity = {
      type: 'sleep',
      startTime: activityStartTime,
      duration: params.normalSleepingHoursDuration
    };
    activities.push(activity);
    timeshiftLeft -= currentDailyTimeShift;
    // lastActivityTime = 0;
  }
  return {activities};
};
