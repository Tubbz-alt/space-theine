import {
  calculate,
  createMelatoninIntakeActivies,
  Result,
  Params,
  Activity
} from "../../app/services/calculator/phase-shift-calculator"
import { DateTime, Duration } from "luxon"

describe("Backend scheduler", () => {
  it("should should not crush when provided proper parameters", () => {
    const params: Params = {
      timeZoneDifference: -6,
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    }
    expect(calculate(params)).toHaveProperty("activities")
  })

  it("should calculate simple time shift", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-05T08:00:00"),
      timeZoneDifference: -6, // positive so we travel west
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    }

    const result = calculate(params)

    expect(result).toHaveProperty("activities")
    expect(result.activities.length).toBe(6)
    expect(result.activities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-05T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
    ])
  })

  it("tests createMelatoninIntakeActivies", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-05T08:00:00"),
      timeZoneDifference: 6, // positive so we travel east
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    }

    const sleep_activity: Activity = {
      startTime: DateTime.fromISO("2020-10-05T23:00:00"),
      duration: Duration.fromISO("PT8H"),
      type: "sleep",
    }

    const result = createMelatoninIntakeActivies(params, [sleep_activity])
    expect(result).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-05T16:30:00"),
        duration: Duration.fromISO("PT5M"),
        type: "melatonin",
      },
    ])



  })
})
