import {
  calculate,
  getNumOfReqShiftDays,
  createSleepActivities,
  createMelatoninIntakeActivies,
  createFoodAvoidanceActivities,
  createBreakfastActivities,
  createLunchActivities,
  createDinnerActivities,
  Params,
  Activity,
} from "../../app/services/calculator/phase-shift-calculator"
import { DateTime, Duration } from "luxon"
import { createFactory } from "react"

describe("Backend scheduler", () => {

  it("tests getNumOfReqShiftDays", () => {
    const params_west: Params = {
      timeZoneDifference: -4,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    const numOfReqShiftDaysWest: number = getNumOfReqShiftDays(params_west)
    expect(numOfReqShiftDaysWest).toBe(4)
    const params_east: Params = {
      timeZoneDifference: 4,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    const numOfReqShiftDaysEast: number = getNumOfReqShiftDays(params_east)
    expect(numOfReqShiftDaysEast).toBe(3)
  })

  it("tests createSleepActivities travelling west", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-06T08:00:00"),
      timeZoneDifference: -4, // travel west
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }

    const sleepActivities = createSleepActivities(params)
    expect(sleepActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T22:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T21:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-09T20:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
    ])
  })

  it("tests createSleepActivities travelling east", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-06T08:00:00"),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }

    const sleepActivities = createSleepActivities(params)
    expect(sleepActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T00:30:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T02:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      }
    ])
  })

  it("tests createFoodAvoidanceActivities", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-06T08:00:00"),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    const sleepActivities: Activity[] = [
      {
        startTime: DateTime.fromISO("2020-10-06T23:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T00:30:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T02:00:00"),
        duration: Duration.fromISO("PT8H"),
        type: "sleep",
      }
    ]
    const foodAvoidanceActivities = createFoodAvoidanceActivities(params, sleepActivities)
    expect(foodAvoidanceActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T21:00:00"),
        duration: Duration.fromISO("PT2H"),
        type: "avoid-food",
      },
      {
        startTime: DateTime.fromISO("2020-10-06T22:30:00"),
        duration: Duration.fromISO("PT2H"),
        type: "avoid-food",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T00:00:00"),
        duration: Duration.fromISO("PT2H"),
        type: "avoid-food",
      }
    ])
  })

  it("tests createBreakfastActivities", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-06T08:00:00"),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    const breakfastActivities = createBreakfastActivities(params)
    expect(breakfastActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T08:00:00"),
        duration: Duration.fromISO("PT30M"),
        type: "breakfast",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T09:30:00"),
        duration: Duration.fromISO("PT30M"),
        type: "breakfast",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T11:00:00"),
        duration: Duration.fromISO("PT30M"),
        type: "breakfast",
      }
    ])
  })

  it("tests createLunchActivities", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-06T08:00:00"),
      timeZoneDifference: 4, // travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    const lunchActivities = createLunchActivities(params)
    expect(lunchActivities).toStrictEqual([
      {
        startTime: DateTime.fromISO("2020-10-06T13:00:00"),
        duration: Duration.fromISO("PT1H"),
        type: "lunch",
      },
      {
        startTime: DateTime.fromISO("2020-10-07T14:30:00"),
        duration: Duration.fromISO("PT1H"),
        type: "lunch",
      },
      {
        startTime: DateTime.fromISO("2020-10-08T16:00:00"),
        duration: Duration.fromISO("PT1H"),
        type: "lunch",
      }
    ])
  })


  it("should should not crush when provided proper parameters", () => {
    const params: Params = {
      timeZoneDifference: -6,
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
    }
    expect(calculate(params)).toHaveProperty("activities")
  })


  it("tests createMelatoninIntakeActivies", () => {
    const params: Params = {
      startAt: DateTime.fromISO("2020-10-05T08:00:00"),
      timeZoneDifference: 6, // positive so we travel east
      normalSleepingHoursStart: { hour: 23, minute: 0 },
      normalSleepingHoursDuration: Duration.fromObject({ hour: 8 }),
      normalBreakfastStart: { hour: 8, minute: 0 },
      normalLunchStart: { hour: 13, minute: 0 },
      normalDinnerStart: { hour: 20, minute: 0 },
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
