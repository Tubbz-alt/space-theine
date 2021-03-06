import {
  calculate,
  getNumOfReqShiftDays,
  createSleepActivities,
  createMelatoninIntakeActivies,
  createFoodAvoidanceActivities,
  createBreakfastActivities,
  createLunchActivities,
  createDinnerActivities,
  createCountermeasureActivities,
  Params,
  Activity,
} from '../../app/services/calculator/phase-shift-calculator';
import { DateTime, Duration } from 'luxon';

describe('Backend scheduler', () => {
  it('should should not crush when provided proper parameters', () => {
    const params: Params = {
      timeZoneDifference: -6,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    expect(calculate(params)).toHaveProperty('activities');
  });

  it('tests getNumOfReqShiftDays', () => {
    const params_west: Params = {
      timeZoneDifference: -4,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    const numOfReqShiftDaysWest: number = getNumOfReqShiftDays(params_west);
    expect(numOfReqShiftDaysWest).toBe(3);
    const params_east: Params = {
      timeZoneDifference: 4,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    const numOfReqShiftDaysEast: number = getNumOfReqShiftDays(params_east);
    expect(numOfReqShiftDaysEast).toBe(4);
  });

  it('should calculate positive time shift', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: 6, // positive so we travel east => we have to wake up earlier
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };

    const activities = createSleepActivities(params);

    expect(activities.length).toBe(4);
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-05T21:30:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-06T20:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T18:30:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-08T17:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
    ]);
  });

  it('should calculate negative time shift', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: -6, // negative so we travel west => we have to wake up later
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };

    const activities = createSleepActivities(params);

    expect(activities.length).toBe(6);
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T00:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T01:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-08T02:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-09T03:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-10T04:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-11T05:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
    ]);
  });

  it('tests createFoodAvoidanceActivities', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-06T08:00:00'),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    const sleepActivities: Activity[] = [
      {
        startTime: DateTime.fromISO('2020-10-06T23:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T00:30:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
      {
        startTime: DateTime.fromISO('2020-10-08T02:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
    ];
    const foodAvoidanceActivities = createFoodAvoidanceActivities(params, sleepActivities);
    expect(foodAvoidanceActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T21:00:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'avoid-food',
      },
      {
        startTime: DateTime.fromISO('2020-10-06T22:30:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'avoid-food',
      },
      {
        startTime: DateTime.fromISO('2020-10-08T00:00:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'avoid-food',
      },
    ]);
  });

  it('tests createCountermeasureActivities going east', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-06T08:00:00'),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    const sleepActivities: Activity[] = [
      {
        startTime: DateTime.fromISO('2020-10-06T23:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
    ];
    const countermeasureActivities = createCountermeasureActivities(params, sleepActivities);
    expect(countermeasureActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T21:00:00'),
        duration: Duration.fromISO('PT1H'),
        type: 'avoid-bright-light',
      },
      {
        startTime: DateTime.fromISO('2020-10-06T22:00:00'),
        duration: Duration.fromISO('PT1H'),
        type: 'seek-darkness',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T07:00:00'),
        duration: Duration.fromISO('PT1H'),
        type: 'seek-bright-light',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T08:00:00'),
        duration: Duration.fromISO('PT4H'),
        type: 'avoid-darkness',
      },
    ]);
  });

  it('tests createCountermeasureActivities going west', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-06T08:00:00'),
      timeZoneDifference: -4, // travel west
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };
    const sleepActivities: Activity[] = [
      {
        startTime: DateTime.fromISO('2020-10-06T23:00:00'),
        duration: Duration.fromISO('PT8H'),
        type: 'sleep',
      },
    ];
    const countermeasureActivities = createCountermeasureActivities(params, sleepActivities);
    expect(countermeasureActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T18:00:00'),
        duration: Duration.fromISO('PT3H'),
        type: 'avoid-darkness',
      },
      {
        startTime: DateTime.fromISO('2020-10-06T20:00:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'seek-bright-light',
      },
      {
        startTime: DateTime.fromISO('2020-10-06T22:55:00'),
        duration: Duration.fromISO('PT5M'),
        type: 'avoid-morning-light',
      },
    ]);
  });

  it('tests createMelatoninIntakeActivies', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: 6, // positive so we travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };

    const sleep_activity: Activity = {
      startTime: DateTime.fromISO('2020-10-05T23:00:00'),
      duration: Duration.fromISO('PT8H'),
      type: 'sleep',
    };

    const result = createMelatoninIntakeActivies(params, [sleep_activity]);
    expect(result).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-05T16:30:00'),
        duration: Duration.fromISO('PT5M'),
        type: 'melatonin',
      },
    ]);
  });
});
