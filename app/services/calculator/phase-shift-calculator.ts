import { DateTime, Duration } from 'luxon';
import { Activities } from '../../screens';

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
  type: 'sleep' | 'melatonin', // @TODO: add more types
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

  let startAt = params.startAt;
  if (startAt === undefined) {
    startAt = DateTime.local();
  }
  const activities = <Activity[]>[]; // just like: let activities: Activity[] = [];

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
  return activities;
};



const createMelatoninIntakeActivies = (
  params: Params, sleep_activities: Activity[]
): Activity[] => {
  let melatonin_intake_activities = <Activity[]>[]
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (const sleep_activity of sleep_activities) {
      const intake_melatonin_time: DateTime = sleep_activity.startTime.minus({ hours: 6.5 })
      const melatonin_intake_activity: Activity = {
        startTime: intake_melatonin_time,
        duration: Duration.fromObject({ minutes: 5 }),
        type: 'melatonin'
      }
      melatonin_intake_activities.push(melatonin_intake_activity)
    }
  } else { /** Westwards */
    /** No Melatonin will be taken westwards */
  }
  return melatonin_intake_activities
}

/* PUBLIC FUNCTIONS */

export const calculate = (params: Params): Result => {
  const activities = <Activity[]>[]; // just like: let activities: Activity[] = [];
  const sleepActivities = addSleepActivities(params);
  activities.push(...sleepActivities);
  return { activities };
};
