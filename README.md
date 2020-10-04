# Space Theine

## Disclaimer

This is a 48h hackathon project so please excuse code quality and bugs.

App provides guidance, but it's up to he user to decide.

## Introduction

Our mobile first application is designed to guide any adventurous individuals in gradually advancing their circadian rhythm to synchronize it with the environment time cues of their travel destination. Carefully timed activities and reminders, which can be displayed in a list or calendar view, inform on when to eat, sleep, take medication, and perform exercise, to slowly habituate the body to the new time zone.

Traveling to distant locations often comes with an unpleasant side effect: jet lag. Your body falls out of its normal day-night cycle and you feel off. It affects all of us, even those traveling to the international space station, but there is a solution. We've developed an app that can help transition to a different timezone without pain. Select the timezone of your destination and provide information on your sleeping habits. Our algorithms create a schedule that slowly prepares you for the time cues of the destination environment.
Everyone carries a phone these days and since we want to frequently inform the user about upcoming activity suggestions and reminders, we decided to develop an application that is optimized for IOS and Android mobile phones. Having considered that many travellers and the crew of the ISS utilize tablets, we made sure that our app design is equally responsive on these devices. We achieved this by building on top of the React Native open-source mobile application framework, which allows us to compile the project for Android and IOS deliverables. Using this technology enabled us to save time by only having one central code base, so that all developments are reflected in upgrades to the app on any OS. At the same time, using the framework allowed a focus solely on improving the features and user experience without having to worry about the underlying logic required to deploy and run the software. The fact that we were able to create a fully functional app with a wide range of features, in less than 20 hours of programming and only two developers, shows the advantage we gained from our choice of technology.
To assist the user effectively, we decided that our app should generate activities and reminders that guide behaviour for a gradual transition of the circadian rhythm to the environment of the destination time zone. A list of color coded cards with icons representing categories present these suggestions. Activities are actions the user should commit to over a specific period. Driven by our research, the app calculates and schedules sleeping, eating and exercise activities. For further assistance, we display the total duration of the activity alongside the time that has passed since it was suggested. Reminders are short actions or preparations that the user should undertake. Based on our findings, our app emits reminders for taking melatonin and seeking or avoiding different light intensities. Just like the activities, the reminder cards display the time that has passed since the suggestion.
In addition to the live updating list of scheduled recommendations, our app provides a calendar view. This makes it easier to see which activities and reminders occur at the same time. It also facilitates an understanding of how the timing of each suggestion type is shifted gradually towards aligning with the destination time zone. A purple line indicates the current location time, so that the user can see and prepare for the upcoming tasks.

![alt text](https://github.com/mrcne/space-theine/blob/main/screens/android3m.jpg?raw=true)
![alt text](https://github.com/mrcne/space-theine/blob/main/screens/ios1.jpg?raw=true)
![alt text](https://github.com/mrcne/space-theine/blob/main/screens/ios2.jpg?raw=true)
![alt text](https://github.com/mrcne/space-theine/blob/main/screens/ios3.jpg?raw=true)

## Setting up development environment

```bash
sudo npm install -g expo-cli
```

## Development

```bash
yarn start
```

## What's working

## TODO
