import {
  calculate,
  createSleepActivities,
  createMelatoninIntakeActivies,
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
      normalBreakfastStart: { hours: 8, minutes: 0 },
      normalLunchStart: { hours: 13, minutes: 0 },
      normalDinnerStart: { hours: 20, minutes: 0 },
    }
    expect(calculate(params)).toHaveProperty("activities")
  })

  it("should calculate positive time shift", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-05T08:00:00"),
      timeZoneDifference: 6, // positive so we travel west => we have to wake up earlier
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
    }

    const activities = createSleepActivities(params)

    expect(activities.length).toBe(4)
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-05T21:30:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-06T20:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T18:30:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T17:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
    ])
  })


  it("should calculate negative time shift", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-05T08:00:00"),
      timeZoneDifference: -6, // negative so we travel west => we have to wake up later
      normalSleepingHoursStart: { hours: 23, minutes: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hours: 8 }),
      normalBreakfastStart: { hours: 8, minutes: 0 },
      normalLunchStart: { hours: 13, minutes: 0 },
      normalDinnerStart: { hours: 20, minutes: 0 },
    }

    const activities = createSleepActivities(params)

    expect(activities.length).toBe(6)
    expect(activities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T00:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T01:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T02:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-09T03:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-10T04:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-11T05:00:00"),
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
      normalBreakfastStart: { hours: 8, minutes: 0 },
      normalLunchStart: { hours: 13, minutes: 0 },
      normalDinnerStart: { hours: 20, minutes: 0 },
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
