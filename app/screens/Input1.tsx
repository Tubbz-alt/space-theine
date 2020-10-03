import { useNavigation } from "@react-navigation/native"
import React, { useContext, useState } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { Button, Header, Screen, Text, TextField, Wallpaper } from "../components"
import { color, spacing, typography } from "../theme"
import { Input, Slider } from 'react-native-elements';
import { theme } from "@storybook/react-native/dist/preview/components/Shared/theme"
import { stateContext } from "../comp/state"
import { Duration } from "luxon"

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

export function Input1() {
  const navigation = useNavigation()
  const [state, update] = useContext(stateContext);
  const [timeZoneDifference, setTimeZoneDifference] = useState(state.input.timeZoneDifference);
  const [sleepTime, setSleepTime] = useState(String(state.input.normalSleepingHoursStart.hours));
  const [sleepDuration, setSleepDuration] = useState(String(state.input.normalSleepingHoursDuration.hours));


  function save() {
    update(state => ({
      ...state,
      input: {
        ...state.input,
        timeZoneDifference,
        normalSleepingHoursStart: {
          hours: Number(sleepTime),
          minutes: 0,
        },
        normalSleepingHoursDuration: Duration.fromMillis(1000 * 60 * 60 * Number(sleepDuration)),
      }
    }));
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerText="SPACE THEINE" style={HEADER} titleStyle={HEADER_TITLE} />

        <Text style={CONTENT}>Timezone difference: {timeZoneDifference.toFixed(1)}</Text>
        <Slider
          value={timeZoneDifference}
          onValueChange={setTimeZoneDifference}
          minimumValue={-12}
          maximumValue={12}
          step={0.5}
          thumbStyle={{backgroundColor: color.primary}}
        />


        <Text style={CONTENT}>Bed time: {isValidHour(sleepTime) && `${sleepTime}:00`}</Text>
        <Input value={sleepTime} onChangeText={setSleepTime}/>
        {!isValidHour(sleepTime) && <Text style={{color: 'red'}}>Provide hour number, e.g. 21</Text>}

        <Text style={CONTENT}>Sleep time: {isValidHour(sleepDuration) && `${sleepDuration} hours`}</Text>
        <Input value={sleepDuration} onChangeText={setSleepDuration}/>
        {!isValidHour(sleepDuration) && <Text style={{color: 'red'}}>Provide hour number, e.g. 21</Text>}

        <Button
          disabled={!isValidHour(sleepTime) || !isValidHour(sleepDuration)}
          style={CONTINUE}
          textStyle={CONTINUE_TEXT}
          text="Save"
          onPress={() => {
            save();
            navigation.navigate('activities');
          }}
        />

        {/*
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Your new app, " />
          <Text style={ALMOST} text="almost" />
          <Text style={TITLE} text="!" />
        </Text>
        <Text style={TITLE} preset="header">nice!</Text>
        <Text style={CONTENT}>
          This probably isn't what your app is going to look like. Unless your designer handed you
          this screen and, in that case, congrats! You're ready to ship.
        </Text>
        <Text style={CONTENT}>
          For everyone else, this is where you'll see a live preview of your fully functioning app
          using Ignite.
        </Text>

        */}
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

function isValidHour(hourString: string): boolean {
  return /^([0-9]|1[0-9]|2[0-4])$/.test(hourString)
}
