import {
  Params,
  Activity,
} from '../../../app/services/calculator/phase-shift-calculator';
import {
  createBreakfastActivities,
  createLunchActivities,
  createDinnerActivities,
} from '../../../app/services/calculator/activities/food';
import { DateTime, Duration } from 'luxon';

describe('Backend scheduler', () => {
  it('tests createBreakfastActivities', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-06T08:00:00'),
      timeZoneDifference: -4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };

    const sleepActivities: Activity[] = [{
      startTime: DateTime.fromISO("2020-10-05T19:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-06T20:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-07T21:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    }];

    const breakfastActivities = createBreakfastActivities(params, sleepActivities);
    expect(breakfastActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T09:00:00'),
        duration: Duration.fromISO('PT30M'),
        type: 'breakfast',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T10:00:00'),
        duration: Duration.fromISO('PT30M'),
        type: 'breakfast',
      },
    ]);
  });

  it('tests createBreakfastActivities positive', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-06T08:00:00'),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    };

    const sleepActivities: Activity[] = [{
      startTime: DateTime.fromISO("2020-10-05T23:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-06T21:30:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-07T20:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    }];

    const breakfastActivities = createBreakfastActivities(params, sleepActivities);
    expect(breakfastActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T06:30:00'),
        duration: Duration.fromISO('PT30M'),
        type: 'breakfast',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T05:00:00'),
        duration: Duration.fromISO('PT30M'),
        type: 'breakfast',
      },
    ]);
  });

  //tests almost ready

  // it('tests createLunchActivities', () => {
  //   const params: Params = {
  //     startAt: DateTime.fromISO('2020-10-06T08:00:00'),
  //     timeZoneDifference: -4, // travel east
  //     normalSleepingHoursStart: { hour: 23, minute: 0 },
  //     normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
  //     normalBreakfastStart: { hour: 8, minute: 0 },
  //     normalLunchStart: { hour: 13, minute: 0 },
  //     normalDinnerStart: { hour: 20, minute: 0 },
  //   };

  //   const sleepActivities: Activity[] = [{
  //     startTime: DateTime.fromISO("2020-10-05T19:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   },{
  //     startTime: DateTime.fromISO("2020-10-06T20:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   },{
  //     startTime: DateTime.fromISO("2020-10-07T21:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   }];

  //   const lunchActivities = createLunchActivities(params, sleepActivities);
  //   expect(lunchActivities).toStrictEqual([
  //     {
  //       startTime: DateTime.fromISO('2020-10-06T13:00:00'),
  //       duration: Duration.fromISO('PT1H'),
  //       type: 'lunch',
  //     },
  //     {
  //       startTime: DateTime.fromISO('2020-10-07T14:00:00'),
  //       duration: Duration.fromISO('PT1H'),
  //       type: 'lunch',
  //     },
  //     {
  //       startTime: DateTime.fromISO('2020-10-08T15:00:00'),
  //       duration: Duration.fromISO('PT1H'),
  //       type: 'lunch',
  //     },
  //   ]);
  // });

  // it('tests createDinnerActivities', () => {
  //   const params: Params = {
  //     startAt: DateTime.fromISO('2020-10-06T08:00:00'),
  //     timeZoneDifference: -4, // travel east
  //     normalSleepingHoursStart: { hour: 23, minute: 0 },
  //     normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
  //     normalBreakfastStart: { hour: 8, minute: 0 },
  //     normalLunchStart: { hour: 13, minute: 0 },
  //     normalDinnerStart: { hour: 20, minute: 0 },
  //   };

  //   const sleepActivities: Activity[] = [{
  //     startTime: DateTime.fromISO("2020-10-05T19:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   },{
  //     startTime: DateTime.fromISO("2020-10-06T20:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   },{
  //     startTime: DateTime.fromISO("2020-10-07T21:00:00"),
  //     duration: Duration.fromISO("PT8H"),
  //     type: "sleep",
  //   }];

  //   const dinnerActivities = createDinnerActivities(params, sleepActivities);
  //   expect(dinnerActivities).toStrictEqual([
  //     {
  //       startTime: DateTime.fromISO('2020-10-06T20:00:00'),
  //       duration: Duration.fromISO('PT1H'),
  //       type: 'dinner',
  //     },
  //     {
  //       startTime: DateTime.fromISO('2020-10-07T21:00:00'),
  //       duration: Duration.fromISO('PT1H'),
  //       type: 'dinner',
  //     },
  //   ]);
  // });
});
