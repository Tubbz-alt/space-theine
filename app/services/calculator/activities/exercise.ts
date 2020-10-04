import { DateTime, Duration } from 'luxon';

import { Params, Activity } from '../phase-shift-calculator';

/* PUBLIC AND PRIVATE CONSTS */

/**
 * Daily exercise (sport) regime
 *
 * ...
 *
 * Based on:
 * "You might get the most out of workouts that take place in mid- to late afternoon.
 * People tend to perform their best and are the least prone to injury between the hours of 3 p.m. and 6 p.m.
 * Try strength-training later in the day. Physical strength also tends to be at its highest point between 2 p.m. and 6 p.m."
 * Source: Source: The Bidirectional Relationship Between Exercise and Sleep: Implications
 * for Exercise Adherence and Sleep Improvement https://journals.sagepub.com/doi/10.1177/1559827614544437
 */
const dailyExerciseDuration: number = 2; // hours
const exerciseWindowPercentStart: number = 50; // percent
const exerciseWindowPercentEnd: number = 68; // percent

/* PUBLIC AND PRIVATE TYPES */

type exerciseWindow = {
  start: DateTime;
  end: DateTime;
}

/* PRIVATE FUNCTIONS */

const getExerciseWindow = (wakeUpTime: DateTime, sleepTime: DateTime): exerciseWindow|null => {
  const awakeDuration: Duration = wakeUpTime.diff(sleepTime);
  const exerciseDelay = Math.abs(awakeDuration.as('hours') * exerciseWindowPercentStart / 100);
  const exerciseEndDelay = Math.abs(awakeDuration.as('hours') * exerciseWindowPercentEnd / 100);
  const exerciseWindowStartTime: DateTime = wakeUpTime.plus({ hours: exerciseDelay });
  const exerciseWindowEndTime: DateTime = wakeUpTime.plus({ hours: exerciseEndDelay });
  if (Math.abs(exerciseWindowEndTime.diff(exerciseWindowStartTime).as('hours')) < dailyExerciseDuration) {
    return null;
  }

  return {
    start: exerciseWindowStartTime,
    end: exerciseWindowEndTime,
  };
};

const getExerciseWindowFromSleep = (previousSleepActivity: Activity|null, currentSleepTime: DateTime): exerciseWindow|null => {
  if (previousSleepActivity === null) {
    return null;
  }
  const previousSleepTimeEnd: DateTime = previousSleepActivity.startTime.plus(previousSleepActivity.duration);
  return getExerciseWindow(previousSleepTimeEnd, currentSleepTime)
};

/* PUBLIC FUNCTIONS */

export const createExerciseActivities = (
  params: Params,
  sleepActivities: Activity[],
): Activity[] => {
  let exerciseActivities = <Activity[]>[];
  var previousSleepActivity = null;
  for (const sleepActivity of sleepActivities) {
    const exerciseWindow = getExerciseWindowFromSleep(previousSleepActivity, sleepActivity.startTime);
    if (exerciseWindow !== null) {
      const exerciseActivity: Activity = {
        startTime: exerciseWindow.start,
        duration: Duration.fromObject({ hours: dailyExerciseDuration }),
        type: 'exercise',
      };
      exerciseActivities.push(exerciseActivity);
    }
    previousSleepActivity = sleepActivity;
  }
  return exerciseActivities;
};
