import { useNavigation } from "@react-navigation/native"
import React, { useContext, useEffect, useReducer, useRef, useState } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { Button, Header, Screen, Text, TextField, Wallpaper } from "../components"
import { color, spacing, typography } from "../theme"
import { Input, Slider } from 'react-native-elements';
import { theme } from "@storybook/react-native/dist/preview/components/Shared/theme"
import { stateContext } from "../comp/state"
import { Duration } from "luxon"
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
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
  backgroundColor: 'black',
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
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
      default: return 'Scratch your ass';
    }
  })();

  const color = (() => {
    switch (activity.type) {
      case 'sleep': return '#323e6a';
      default: return 'gray';
    }
  })();

  let diffNow = activity.startTime.diffNow();

  let diffMessage;

  if (diffNow.minutes >= -1 && diffNow.minutes <= 1) {
    diffMessage = 'just now';
  } else if (diffNow.minutes > 1) {
    diffMessage = `in ${diffNow.minutes} minutes`;
  } else {
    diffMessage = `${diffNow.minutes} ago`;
  }

  return (
    <View style={{backgroundColor: color, padding: 10}}>
      <Text style={{color: 'white'}}>{title}</Text>
      <Text style={{color: 'white'}}>{diffMessage}</Text>
    </View>
  )
}

export function Activities() {
  const navigation = useNavigation()
  const [state, update] = useContext(stateContext);

  return (
    <View style={FULL}>
      <Wallpaper />
      <Header
        style={HEADER}
        titleStyle={HEADER_TITLE}
        leftIcon="back"
        onLeftPress={() => navigation.navigate('input1')}
      />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        {state.activities.map((a, i) => (
          <ActivityBox activity={a} key={i} />
        ))}
        <Text style={{color: 'black'}}>DEBUG: {JSON.stringify(state)}</Text>
      </Screen>
    </View>
  )
}
