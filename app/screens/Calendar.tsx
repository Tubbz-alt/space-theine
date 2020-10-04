import { useNavigation } from "@react-navigation/native"
import React, { useContext, useEffect, useReducer, useRef, useState } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { Button, Header, Screen, Text, TextField, Wallpaper } from "../components"
import { color, spacing, typography } from "../theme"
import { Input, Slider } from 'react-native-elements';
import { theme } from "@storybook/react-native/dist/preview/components/Shared/theme"
import { stateContext } from "../comp/state"
import { DateTime, Duration } from "luxon"
import { Activity } from "../services/calculator/phase-shift-calculator"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  backgroundColor: color.primaryDarker,
  paddingTop: spacing[3],
  paddingBottom: spacing[3],
  paddingHorizontal: spacing[4],
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.textAlternative,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}

const ACTIVITY_BOX: ViewStyle = {
  padding: 20,
  paddingBottom: 20,
  marginVertical: 6,
  borderRadius: 5,
  shadowColor: "#000000",
  shadowRadius: 5,
  shadowOpacity: 0.5,
  shadowOffset: { width: 5, height: 5 },
}

const ACTIVITY_CONTAINER: ViewStyle = {
  ...CONTAINER,
  paddingVertical: 12,
}

function ActivityBox({ activity }: { activity: Activity }) {
  const ref = useRef<any>(0);
  const [, forceUpdate] = useReducer(n => n+1, 0);

  useEffect(() => {
      ref.current = setInterval(forceUpdate, 1000 * 60);
      return () => clearInterval(ref.current);
  }, []);

  const title = (() => {
    switch (activity.type) {
      case 'sleep': return 'Time for sleep!';
      case 'melatonin': return 'Take melatonin!';
      default: return 'Scratch your ass';
    }
  })();

  const color = (() => {
    switch (activity.type) {
      case 'sleep': return '#5D2555';
      case 'melatonin': return '#ad3d3f';
      /*case 'medicine': return '#a25c5d';
      case 'work': return '#4f6cbd';
      case 'food': return '#f3b933';
      */
      default: return 'gray';
    }
  })();

  return (
    <View style={{...ACTIVITY_BOX, backgroundColor: color}}>
      <Text style={{color: 'white'}}>{title}</Text>
    </View>
  )
}

export function Calendar() {
  const navigation = useNavigation()
  const [state, update] = useContext(stateContext);

  console.log(DateTime.local().minus({ minutes: 5, seconds: 1 }).diffNow().normalize().minutes);

  return (
    <View style={FULL}>
      <Wallpaper />
      <Header
        style={HEADER}
        titleStyle={HEADER_TITLE}
        leftIcon="back"
        headerText="SPACE THEINE"
        onLeftPress={() => navigation.navigate('activities')}
      />
      <Screen style={ACTIVITY_CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        {state.activities.map((a, i) => (
          <ActivityBox activity={a} key={i} />
        ))}
        <Text style={{color: 'black'}}>DEBUG: {JSON.stringify(state)}</Text>
      </Screen>
    </View>
  )
}
