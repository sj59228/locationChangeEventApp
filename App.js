import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Header,
  Alert,
  SafeAreaView
} from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import SafeViewAndroid from "./components/SafeViewAndroid";
import axios from "axios";

const API_KEY = "4424514ae2f3c258b3e8defd1c01a54d";

// TaskManager.defineTask(
//   YOUR_TASK_NAME,
//   ({ data: { eventType, region }, error }) => {
//     if (error) {
//       // check `error.message` for more details.
//       return;
//     }
//     if (eventType === Location.GeofencingEventType.Enter) {
//       console.log("You've entered region:", region);
//     } else if (eventType === Location.GeofencingEventType.Exit) {
//       console.log("You've left region:", region);
//     }
//   }
// );

export default class App extends Component {
  state = {
    isLoading: true,
    latitude: "",
    longitude: ""
  };

  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.setState({
        latitude: latitude,
        longitude: longitude
      });

      this.getWeather(latitude, longitude);
    } catch (error) {
      1;
      Alert.alert("Can't find you", "So sad");
    }
  };

  // locationChangeEvent = async () => {
  //   await Location.requestPermissionsAsync();
  //   const {
  //     coords: { latitude, longitude }
  //   } = await Location.getCurrentPositionAsync();
  //   this.setState({
  //     latitude: latitude,
  //     longitude: longitude
  //   });
  //   this.getWeather(latitude, longitude);

  //   await Location.startLocationUpdatesAsync("firstTask", {
  //     accuracy: Location.Accuracy.BestForNavigation,
  //     timeInterval: 3000,
  //     distanceInterval: 1,
  //     showsBackgroundLocationIndicator: true,
  //     foregroundService: {
  //       notificationTitle: "Location Change Event",
  //       notificationBody: "Background location is running...",
  //       notificationColor: "white"
  //     }
  //   });
  // };

  // locationChangeEvent2 = async () => {
  //   await Location.requestPermissionsAsync();
  //   const newRegions = [];

  //   newRegions.push({
  //     latitude: 37.2478849,
  //     longitude: 127.0773653,
  //     radius: 20
  //   });

  //   await Location.startGeofencingAsync("locationTask", newRegions);
  // };

  sumEvent = async () => {
    await Location.requestPermissionsAsync();
    await Audio.requestPermissionsAsync();
    await Location.startLocationUpdatesAsync("startTask", {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 10 * 1000,
      // distanceInterval: 10,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location Change Event",
        notificationBody: "Background location is running...",
        notificationColor: "white"
      }
    });
  };

  componentDidMount() {
    // await Location.requestPermissionsAsync();
    this.getLocation();
    // this.locationChangeEvent();
    // this.locationChangeEvent2();
    this.sumEvent();
  }

  render() {
    const { condition, latitude, longitude } = this.state;
    return (
      <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            hidden={false}
            backgroundColor="black"
            translucent={true}
          />
          <View style={styles.topContainer}>
            <Text style={styles.titleText}>위치 기반 반응 App</Text>
          </View>
          <View style={styles.mainContainer}>
            <Text>{condition} </Text>
            <Text>{latitude} </Text>
            <Text>{longitude} </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  topContainer: {
    flex: 1,
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center"
  },
  titleText: {
    fontSize: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  mainContainer: {
    flex: 10,
    // backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center"
  }
});

// TaskManager.defineTask("firstTask", ({ data: { locations }, error }) => {
//   if (error) {
//     // check `error.message` for more details.
//     return;
//   }
//   // Alert.alert("대박");
//   Alert.alert(
//     "latitude : " +
//       locations[0].coords.latitude +
//       "\nlongitude : " +
//       locations[0].coords.longitude
//   );
//   console.log("Received new locations", locations);
//   console.log("latitude", locations[0].coords.latitude);
//   console.log("longitude", locations[0].coords.longitude);
// });

// TaskManager.defineTask(
//   "locationTask",
//   ({ data: { eventType, region }, error }) => {
//     if (error) {
//       // check `error.message` for more details.
//       return;
//     }
//     if (eventType === Location.GeofencingEventType.Enter) {
//       Alert.alert("들어왔다.");
//       console.log("You've entered region:", region);
//     } else if (eventType === Location.GeofencingEventType.Exit) {
//       Alert.alert("나갔다.");
//       console.log("You've left region:", region);
//     }
//   }
// );

TaskManager.defineTask("startTask", ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  // Alert.alert("대박");
  console.log("Received new locations", locations);
  console.log("latitude", locations[0].coords.latitude);
  console.log("longitude", locations[0].coords.longitude);
  const newRegions = [];

  newRegions.push({
    latitude: 37.2478849,
    longitude: 127.0773653,
    radius: 20
  });

  Location.startGeofencingAsync("secondTask", newRegions);
});

TaskManager.defineTask(
  "secondTask",
  async ({ data: { eventType, region }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      Alert.alert("들어왔다.");

      // await Audio.setAudioModeAsync({
      //   playsInSilentModeIOS: true,
      //   allowsRecordingIOS: true,
      //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      //   shouldDuckAndroid: false,
      //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      //   playThroughEarpieceAndroid: true
      // });
      // Audio.setIsEnabledAsync("false");
      console.log("You've entered region:", region);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      Alert.alert("나갔다.");
      console.log("You've left region:", region);
    }
  }
);
