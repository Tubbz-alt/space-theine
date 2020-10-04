import {
  createSleepActivities,
  Params,
  Activity,
} from '../../../app/services/calculator/phase-shift-calculator';
import { createExerciseActivities } from '../../../app/services/calculator/activities/exercise';
import { DateTime, Duration } from 'luxon';

describe('Backend scheduler', () => {
  it('should calculate exercise times forwards', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: -6, // negative so we travel west => we have to wake up later
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    };

    const sleepActivities: Activity[] = [{
      startTime: DateTime.fromISO("2020-10-05T23:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-07T00:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-08T01:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    }];

    const activities = createExerciseActivities(params, sleepActivities);

    expect(activities.length).toBe(2);
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T15:30:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'exercise',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T16:30:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'exercise',
      },
    ]);
  });

  it('should calculate exercise times backwards', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: 6, // negative so we travel west => we have to wake up later
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
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

    const activities = createExerciseActivities(params, sleepActivities);

    expect(activities.length).toBe(2);
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO('2020-10-06T14:15:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'exercise',
      },
      {
        startTime: DateTime.fromISO('2020-10-07T12:45:00'),
        duration: Duration.fromISO('PT2H'),
        type: 'exercise',
      },
    ]);
  });

  it('should not allow exercise when little sleep', () => {
    const params: Params = {
      startAt: DateTime.fromISO('2020-10-05T08:00:00'),
      timeZoneDifference: 6, // negative so we travel west => we have to wake up later
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    };

    const sleepActivities: Activity[] = [{
      startTime: DateTime.fromISO("2020-10-05T23:00:00"),
      duration: Duration.fromISO("PT12H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-06T21:30:00"),
      duration: Duration.fromISO("PT12H"),
      type: "sleep",
    },{
      startTime: DateTime.fromISO("2020-10-07T20:00:00"),
      duration: Duration.fromISO("PT12H"),
      type: "sleep",
    }];

    const activities = createExerciseActivities(params, sleepActivities);

    expect(activities.length).toBe(0);
  });
});
