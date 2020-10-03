import React, { useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text } from '../components';
import { Activity, SimpleTime } from '../services/calculator/phase-shift-calculator';
import { Duration } from 'luxon';

export type State = {
  input: {
    timeZoneDifference: number,
    normalSleepingHoursStart: SimpleTime,
    normalSleepingHoursDuration: Duration,
  },
  activities: Activity[],
}

const DEFAULT_STATE: State = {
  input: {
    timeZoneDifference: 0,
    normalSleepingHoursStart: {
      hours: 23,
      minutes: 0,
    },
    normalSleepingHoursDuration: Duration.fromMillis(1000 * 60 * 60 * 8),
  },
  activities: [],
}

let globalState: State | null = null;

function reducer(oldState: State, update: (state: State) => State) {
  globalState = update(oldState);
  console.log(oldState, 'changed to');
  console.log(globalState);
  return globalState;
}

export const stateContext = React.createContext<[State, React.Dispatch<(state: State) => State>]>([DEFAULT_STATE, () => DEFAULT_STATE]);

export function StateProvider({ children }: any) {
  let [ready, setReady] = useState(false);
  let [state, update] = useReducer(reducer, DEFAULT_STATE);

  useEffect(() => {
    AsyncStorage.getItem('state')
      .then(state => (state && JSON.parse(state)) || DEFAULT_STATE)
      .then(state => {
        update(() => state);
        setReady(true);
      })
  }, []);

  if (!ready) {
    return <Text>loading...</Text>;
  }

  return (
    <stateContext.Provider value={[state, update]}>
      {children}
    </stateContext.Provider>
  )
}
