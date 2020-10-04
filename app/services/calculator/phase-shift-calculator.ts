import { DateTime, Duration } from 'luxon';
import { Activities } from '../../screens';
import { compareDatesAsc } from '../../utils/date';

/* PUBLIC AND PRIVATE CONSTS */

/**
 * Maximum daily time shift (in hours)
 *
 * We don't use words East/West in variable names, we just focus on numeric change
 *
 * based on:
 * @TODO
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
  normalBreakfastStart: SimpleTime | null,
  normalLunchStart: SimpleTime | null,
  normalDinnerStart: SimpleTime | null,
}

export type Activity = {
  startTime: DateTime,
  duration: Duration,
  type: 'sleep' | 'melatonin' | 'avoid-bright-light' | 'seek-darkness' | 'seek-bright-light' | 'avoid-darkness' | 'avoid-morning-light' | 'exercise' | 'avoid-food',
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

export const createSleepActivities = (params: Params): Activity[] => {
  const timeshiftDirectionPositive = isTimeshiftPositive(params); // I know...
  const currentDailyTimeShift = getCurrentPossibleTimeShift(params);
  // if time shift is positive it means we travel west => so we should wake up ealier => so we dailyShift should be negative
  // i'M So lOgiCaL
  const currentDailyTimeShiftWithSign = timeshiftDirectionPositive ? -currentDailyTimeShift : currentDailyTimeShift;

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
    activityStartTime = activityStartTime.plus({ days: dayNumber, hours: currentDailyTimeShiftWithSign * (dayNumber + 1) });

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


/** TODO: Add test */
export const createFoodAvoidanceActivities = (
  params: Params, sleepActivities: Activity[]
): Activity[] => {
  let foodAvoidanceActivities = <Activity[]>[]
  for (const sleepActivity of sleepActivities) {
    const avoidFoodActivity: Activity = {
      startTime: sleepActivity.startTime.minus({ hours: 2 }),
      duration: Duration.fromObject({ hours: 2 }),
      type: 'avoid-food'
    }
    foodAvoidanceActivities.push(avoidFoodActivity)
  }
  return foodAvoidanceActivities
}




/** TODO: Add test */
export const createCountermeasureActivities = (
  params: Params, sleepActivities: Activity[]
): Activity[] => {
  let countermeasureActivities = <Activity[]>[]
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (const sleepActivity of sleepActivities) {
      /** minimize evening light exposure */
      const avoidBrightLightActivity: Activity = {
        startTime: sleepActivity.startTime.minus({ hours: 2 }),
        duration: Duration.fromObject({ hours: 1 }),
        type: 'avoid-bright-light'
      }
      const seekDarknessActivity: Activity = {
        startTime: sleepActivity.startTime.minus({ hours: 1 }),
        duration: Duration.fromObject({ hours: 1 }),
        type: 'seek-darkness'
      }
      countermeasureActivities.push(avoidBrightLightActivity)
      countermeasureActivities.push(seekDarknessActivity)
      /** maximize morning light exposure */
      const seekBightLightActivity: Activity = {
        startTime: sleepActivity.startTime.plus(sleepActivity.duration),
        duration: Duration.fromObject({ hours: 1 }),
        type: 'seek-bright-light'
      }
      const avoidDarknessActivity: Activity = {
        startTime: sleepActivity.startTime.plus(sleepActivity.duration.plus({ hours: 1 })),
        duration: Duration.fromObject({ hours: 4 }),
        type: 'avoid-darkness'
      }
      countermeasureActivities.push(seekBightLightActivity)
      countermeasureActivities.push(avoidDarknessActivity)
    }
  } else { /** Westwards */
    for (const sleepActivity of sleepActivities) {
      /** maximize evening light exposure */
      const avoidDarknessActivity: Activity = {
        startTime: sleepActivity.startTime.minus({ hours: 5 }),
        duration: Duration.fromObject({ hours: 4 }),
        type: 'avoid-darkness'
      }
      const seekBightLightActivity: Activity = {
        startTime: sleepActivity.startTime.minus({ hours: 1 }),
        duration: Duration.fromObject({ hours: 1 }),
        type: 'seek-bright-light'
      }
      countermeasureActivities.push(seekBightLightActivity)
      countermeasureActivities.push(avoidDarknessActivity)
      /** minimize morning light exposure */
      const avoidMorningLightActivity: Activity = {
        startTime: sleepActivity.startTime,
        duration: Duration.fromObject({ minutes: 5 }),
        type: 'avoid-morning-light'
      }
      countermeasureActivities.push(avoidMorningLightActivity)
    }

  }
  return countermeasureActivities
}


export const createMelatoninIntakeActivies = (
  params: Params, sleepActivities: Activity[]
): Activity[] => {
  let melatoninIntakeActivities = <Activity[]>[]
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (const sleepActivity of sleepActivities) {
      const intakeMelatoninTime: DateTime = sleepActivity.startTime.minus({ hours: 6.5 })
      const melatoninIntakeActivity: Activity = {
        startTime: intakeMelatoninTime,
        duration: Duration.fromObject({ minutes: 5 }),
        type: 'melatonin'
      }
      melatoninIntakeActivities.push(melatoninIntakeActivity)
    }
  } else { /** Westwards */
    /** No Melatonin will be taken westwards */
  }
  return melatoninIntakeActivities
}

/* PUBLIC FUNCTIONS */

export const calculate = (params: Params): Result => {
  const activities = <Activity[]>[]; // just like: let activities: Activity[] = [];

  const sleepActivities = createSleepActivities(params);
  activities.push(...sleepActivities);

  const foodAvoidanceActivities = createFoodAvoidanceActivities(params, sleepActivities);
  activities.push(...foodAvoidanceActivities);

  const countermeasureActivities = createCountermeasureActivities(params, sleepActivities);
  activities.push(...countermeasureActivities);

  const melatoninIntakeActivities = createMelatoninIntakeActivies(params, sleepActivities)
  activities.push(...melatoninIntakeActivities);

  activities.sort((a, b) => compareDatesAsc(a.startTime, b.startTime));

  return { activities };
};
