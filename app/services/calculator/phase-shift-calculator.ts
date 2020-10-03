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

const getCurrentPossibleTimeShift = (params: Params): number => {
  return isTimeshiftPositive(params) ?
    maximumDailyTimeShiftNegative : maximumDailyTimeShiftPositive;
};

/**
 * In other words: Is timeshift westward
 */
const isTimeshiftPositive = (params: Params): boolean => {
  return params.timeZoneDifference > 0;
};

/* FUNCTIONS MADE PUBLIC FOR UNIT TESTS */

export const addSleepActivities = (params: Params): Activity[] => {
  const timeshiftDirectionPositive = isTimeshiftPositive(params); // I know...
  const currentDailyTimeShift = getCurrentPossibleTimeShift(params);
  // if time shift is positive it means we travel west => so we should wake up ealier => so we dailyShift should be negative
  // i'M So lOgiCaL
  const currentDailyTimeShiftWithSign = timeshiftDirectionPositive? -currentDailyTimeShift : currentDailyTimeShift;

  let startAt = params.startAt;
  if (startAt === undefined) {
    startAt = DateTime.local();
  }
  const activities = <Activity[]>[]; // just like: let activities: Activity[] = [];

  let timeshiftLeft = Math.abs(params.timeZoneDifference);
  // let lastActivityTime: DateTime|null = null;
  let dayNumber = 0;
  while (timeshiftLeft > 0) {
    let activityStartTime = DateTime.fromObject({
      ...startAt.toObject(),
      hour: params.normalSleepingHoursStart.hours,
      minute: params.normalSleepingHoursStart.minutes,
      second: 0,
      millisecond: 0,
    });
    activityStartTime = activityStartTime.plus({days: dayNumber, hours: currentDailyTimeShiftWithSign*(dayNumber+1)});

    let activity: Activity = {
      type: 'sleep',
      startTime: activityStartTime,
      duration: params.normalSleepingHoursDuration
    };
    activities.push(activity);
    timeshiftLeft -= currentDailyTimeShift;
    // lastActivityTime = 0;
    dayNumber++;
  }
  return activities;
};

/* PUBLIC FUNCTIONS */

export const calculate = (params: Params): Result => {
  const activities = <Activity[]>[]; // just like: let activities: Activity[] = [];
  const sleepActivities = addSleepActivities(params);
  activities.push(...sleepActivities);
  return {activities};
};
