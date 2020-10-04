import { l } from 'i18n-js';
import { Duration, DateTime } from 'luxon';
import { negate } from 'ramda';

import { Params, Activity, MAX_DAILY_TIME_SHIFT_NEGATIVE, MAX_DAILY_TIME_SHIFT_POSITIVE } from '../phase-shift-calculator';

/* PUBLIC AND PRIVATE CONSTS */

/* PUBLIC AND PRIVATE TYPES */

/* PRIVATE FUNCTIONS */

/* PUBLIC FUNCTIONS */

// TO REFACTOR!
export const createBreakfastActivities = (
  params: Params,
  sleepActivities: Activity[],
): Activity[] => {
  if (!params.normalBreakfastStart) {
    return sleepActivities;
  }
  const isPositive = params.timeZoneDifference > 0;
  let exerciseActivities = <Activity[]>[];
  let previousStart = null;
  for (const [day, sleepActivity] of sleepActivities.entries()) {
    if (previousStart !== null) {
      const increment = isPositive? -(day*MAX_DAILY_TIME_SHIFT_NEGATIVE.as('hour')) : (day*MAX_DAILY_TIME_SHIFT_POSITIVE.as('hour'));
      console.log(Duration.fromObject({hour: increment}).as('hour'));
      const start = sleepActivity.startTime.set({ // close your eyes
        hour: params.normalBreakfastStart.hour,
        minute: params.normalBreakfastStart.minute,
      }).plus(Duration.fromObject({hour: increment}));
      console.log(start.toISO());
      const exerciseActivity: Activity = {
        startTime: start,
        duration: Duration.fromObject({ minute: 30 }),
        type: 'breakfast',
      };
      exerciseActivities.push(exerciseActivity);
    }
    previousStart = sleepActivity.startTime;
  }
  return exerciseActivities;
};

// TO REFACTOR!
export const createLunchActivities = (
  params: Params,
  sleepActivities: Activity[],
): Activity[] => {
  if (!params.normalLunchStart) {
    return sleepActivities;
  }
  const isPositive = params.timeZoneDifference > 0;
  let exerciseActivities = <Activity[]>[];
  let previousStart = null;
  for (const [day, sleepActivity] of sleepActivities.entries()) {
    if (previousStart !== null) {
      const increment = isPositive? -(day*MAX_DAILY_TIME_SHIFT_NEGATIVE.as('hour')) : (day*MAX_DAILY_TIME_SHIFT_POSITIVE.as('hour'));
      const start = sleepActivity.startTime.set({ // close your eyes
        hour: params.normalLunchStart.hour,
        minute: params.normalLunchStart.minute,
      }).plus(Duration.fromObject({hour: increment}));
      const exerciseActivity: Activity = {
        startTime: start,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'lunch',
      };
      exerciseActivities.push(exerciseActivity);
    }
    previousStart = sleepActivity.startTime;
  }
  return exerciseActivities;
};

// TO REFACTOR!
export const createDinnerActivities = (
  params: Params,
  sleepActivities: Activity[],
): Activity[] => {
  if (!params.normalDinnerStart) {
    return sleepActivities;
  }
  const isPositive = params.timeZoneDifference > 0;
  let exerciseActivities = <Activity[]>[];
  let previousStart = null;
  for (const [day, sleepActivity] of sleepActivities.entries()) {
    if (previousStart !== null) {
      const increment = isPositive? -(day*MAX_DAILY_TIME_SHIFT_NEGATIVE.as('hour')) : (day*MAX_DAILY_TIME_SHIFT_POSITIVE.as('hour'));
      const start = sleepActivity.startTime.set({ // close your eyes
        hour: params.normalDinnerStart.hour,
        minute: params.normalDinnerStart.minute,
      }).plus(Duration.fromObject({hour: increment}));
      const exerciseActivity: Activity = {
        startTime: start,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'dinner',
      };
      exerciseActivities.push(exerciseActivity);
    }
    previousStart = sleepActivity.startTime;
  }
  return exerciseActivities;
};
