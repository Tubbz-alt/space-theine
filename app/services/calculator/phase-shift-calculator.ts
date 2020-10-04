import { DateTime, Duration } from 'luxon';
import { compareDatesAsc } from '../../utils/date';

/* PUBLIC AND PRIVATE CONSTS */

const MAX_DAILY_TIME_SHIFT_NEGATIVE: Duration = Duration.fromObject({ hours: 1 });
const MAX_DAILY_TIME_SHIFT_POSITIVE: Duration = Duration.fromObject({ hours: 1, minutes: 30 })


/* PUBLIC AND PRIVATE TYPES */

export type SimpleTime = { // @TODO: library?
  hour: number,
  minute: number,
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
  type: 'sleep' |
  'melatonin' |
  'avoid-bright-light' |
  'seek-darkness' |
  'seek-bright-light' |
  'avoid-darkness' |
  'avoid-morning-light' |
  'avoid-food',
}

export type Result = {
  activities: Array<Activity>,
}


/* PRIVATE FUNCTIONS */

export const getNumOfReqShiftDays = (
  params: Params
): number => {
  if (params.timeZoneDifference > 0) { /** Eastwards */
    return Math.ceil(Math.abs(params.timeZoneDifference / MAX_DAILY_TIME_SHIFT_POSITIVE.as("hours")))
  } else { /** Westwards */
    return Math.ceil(Math.abs(params.timeZoneDifference / MAX_DAILY_TIME_SHIFT_NEGATIVE.as("hours")))
  }
}

export const createSleepActivities = (
  params: Params
): Activity[] => {
  let sleepActivities = <Activity[]>[]
  const startTime = params.startAt || DateTime.local()
  const numOfReqShiftDays: number = getNumOfReqShiftDays(params)
  let dailyTimeShift = startTime.set(params.normalSleepingHoursStart)
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const sleepingStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const sleepActivity: Activity = {
        startTime: sleepingStart,
        duration: params.normalSleepingHoursDuration,
        type: 'sleep'
      }
      sleepActivities.push(sleepActivity)
      dailyTimeShift = dailyTimeShift.plus(MAX_DAILY_TIME_SHIFT_POSITIVE)
    }
  } else { /** Westwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const sleepingStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const sleepActivity: Activity = {
        startTime: sleepingStart,
        duration: params.normalSleepingHoursDuration,
        type: 'sleep'
      }
      sleepActivities.push(sleepActivity)
      dailyTimeShift = dailyTimeShift.minus(MAX_DAILY_TIME_SHIFT_NEGATIVE)
    }
  }
  return sleepActivities
}


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
export const createBreakfastActivities = (
  params: Params
): Activity[] => {
  let breakfastActivities = <Activity[]>[]
  if (!params.normalBreakfastStart) {
    return breakfastActivities
  }
  const startTime = params.startAt || DateTime.local()
  const numOfReqShiftDays: number = getNumOfReqShiftDays(params)
  let dailyTimeShift = startTime.set(params.normalBreakfastStart)
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const breakfastStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const breakfastActivity: Activity = {
        startTime: breakfastStart,
        duration: Duration.fromObject({ minute: 30 }),
        type: 'sleep'
      }
      breakfastActivities.push(breakfastActivity)
      dailyTimeShift = dailyTimeShift.plus(MAX_DAILY_TIME_SHIFT_POSITIVE)
    }
  } else { /** Westwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const breakfastStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const breakfastActivity: Activity = {
        startTime: breakfastStart,
        duration: Duration.fromObject({ minute: 30 }),
        type: 'sleep'
      }
      breakfastActivities.push(breakfastActivity)
      dailyTimeShift = dailyTimeShift.minus(MAX_DAILY_TIME_SHIFT_NEGATIVE)
    }
  }
  return breakfastActivities
}

/** TODO: Add test */
export const createLunchActivities = (
  params: Params
): Activity[] => {
  let lunchActivities = <Activity[]>[]
  if (!params.normalLunchStart) {
    return lunchActivities
  }
  const startTime = params.startAt || DateTime.local()
  const numOfReqShiftDays: number = getNumOfReqShiftDays(params)
  let dailyTimeShift = startTime.set(params.normalLunchStart)
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const lunchStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const lunchActivity: Activity = {
        startTime: lunchStart,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'sleep'
      }
      lunchActivities.push(lunchActivity)
      dailyTimeShift = dailyTimeShift.plus(MAX_DAILY_TIME_SHIFT_POSITIVE)
    }
  } else { /** Westwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const lunchStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const lunchActivity: Activity = {
        startTime: lunchStart,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'sleep'
      }
      lunchActivities.push(lunchActivity)
      dailyTimeShift = dailyTimeShift.minus(MAX_DAILY_TIME_SHIFT_NEGATIVE)
    }
  }
  return lunchActivities
}



/** TODO: Add test */
export const createDinnerActivities = (
  params: Params
): Activity[] => {
  let dinnerActivities = <Activity[]>[]
  if (!params.normalDinnerStart) {
    return dinnerActivities
  }
  const startTime = params.startAt || DateTime.local()
  const numOfReqShiftDays: number = getNumOfReqShiftDays(params)
  let dailyTimeShift = startTime.set(params.normalDinnerStart)
  if (params.timeZoneDifference > 0) { /** Eastwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const dinnerStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const dinnerActivity: Activity = {
        startTime: dinnerStart,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'sleep'
      }
      dinnerActivities.push(dinnerActivity)
      dailyTimeShift = dailyTimeShift.plus(MAX_DAILY_TIME_SHIFT_POSITIVE)
    }
  } else { /** Westwards */
    for (var day = 0; day < numOfReqShiftDays; day++) {
      const dinnerStart = startTime.plus({ day: day }).set({
        hour: dailyTimeShift.get("hour"),
        minute: dailyTimeShift.get("minute")
      })
      const dinnerActivity: Activity = {
        startTime: dinnerStart,
        duration: Duration.fromObject({ hour: 1 }),
        type: 'sleep'
      }
      dinnerActivities.push(dinnerActivity)
      dailyTimeShift = dailyTimeShift.minus(MAX_DAILY_TIME_SHIFT_NEGATIVE)
    }
  }
  return dinnerActivities
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
