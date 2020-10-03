import { calculate, addSleepActivities, Result, Params } from "../../app/services/calculator/phase-shift-calculator"
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

    const activities = addSleepActivities(params)

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
})
