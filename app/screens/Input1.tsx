import { useNavigation } from "@react-navigation/native"
import React, { useContext, useState } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { Button, Header, Screen, Text, TextField, Wallpaper } from "../components"
import { color, spacing, typography } from "../theme"
import { Input, Slider } from 'react-native-elements';
import { theme } from "@storybook/react-native/dist/preview/components/Shared/theme"
import { stateContext } from "../comp/state"
import { Duration } from "luxon"
import { calculate } from "../services/calculator/phase-shift-calculator"


const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.text,
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
  color: color.text,
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.primary,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.textAlternative,
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
        normalSleepingHoursDuration: Duration.fromObject({ hours: Number(sleepDuration) }),
        fresh: true,
        normalBreakfastStart: {
          hours: ((Number(sleepTime) + Number(sleepDuration)) % 24) + 1,
          minutes: 0,
        },
        normalLunchStart: {
          hours: ((Number(sleepTime) + Number(sleepDuration)) % 24) + 1 + 5,
          minutes: 0,
        },
        normalDinnerStart: {
          hours: ((Number(sleepTime) + Number(sleepDuration)) % 24) + 1 + 5 + 5,
          minutes: 0,
        },
      }
    }));
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Header headerText="SPACE THEINE" style={HEADER} titleStyle={HEADER_TITLE} />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>


        <Text style={CONTENT}>Timezone difference: {timeZoneDifference.toFixed(1)}</Text>
        <Slider
          value={timeZoneDifference}
          onValueChange={setTimeZoneDifference}
          minimumValue={-12}
          maximumValue={12}
          step={0.5}
          thumbStyle={{backgroundColor: color.primary}}
          style={{width: '100%', marginTop: -20, marginBottom: 30}}
          trackStyle={{marginTop: 0}}
        />


        <Text style={CONTENT}>Bed time: {isValidHour(sleepTime) && `${sleepTime}:00`}</Text>
        <Input value={sleepTime} onChangeText={setSleepTime}/>
        {!isValidHour(sleepTime) && <Text style={{color: 'red'}}>Provide hour number, e.g. 21</Text>}

        <Text style={CONTENT}>Sleep time: {isValidHour(sleepDuration) && `${sleepDuration} hours`}</Text>
        <Input value={sleepDuration} onChangeText={setSleepDuration}/>
        {!isValidHour(sleepDuration) && <Text style={{color: 'red'}}>Provide hour number, e.g. 21</Text>}

      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            disabled={!isValidHour(sleepTime) || !isValidHour(sleepDuration)}
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
            onPress={() => {
              save();
              navigation.navigate('calculating');
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

function isValidHour(hourString: string): boolean {
  return /^([0-9]|1[0-9]|2[0-4])$/.test(hourString)
}
