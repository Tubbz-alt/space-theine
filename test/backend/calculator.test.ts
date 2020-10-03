import {calculate, Result, Params} from '../../app/services/calculator/phase-shift-calculator';
import {DateTime, Duration} from 'luxon';

describe("Backend scheduler", () => {
  it("should construct a proper object", () => {
    const params: Params = {
      timeZoneDifference: 6,
      normalSleepingHoursStart: {hours: 23, minutes: 0},
      normalSleepingHoursDuration: Duration.fromObject({hours: 8}),
    };
    expect(calculate(params)).toHaveProperty('activities');
  });
  it("should calculate simple time shift", () => {

  });
});
