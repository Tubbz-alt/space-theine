import * as Font from "expo-font"
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
   await Font.loadAsync({
     // 'Material Icons': MaterialIcons,
     // 'MaterialIcons': MaterialIcons,
     // FontAwesome5_Solid: require("./FontAwesome.ttf"),
     // "Montserrat-Regular": require("./Montserrat-Regular.ttf"),
   })

}
