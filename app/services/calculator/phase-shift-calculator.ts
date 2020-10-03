import {DateTime, Duration} from 'luxon';

export type SimpleTime = { // @TODO: library?
  hours: number,
  minutes: number,
}

export type Params = {
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

export const calculate = (Params): Result => {
  const activity1: Activity = {
    startTime: DateTime.local(),
    duration: Duration.fromObject({hours: 2}),
    type: 'sleep',
  };
  return {activities: [
    activity1,
  ]};
}
