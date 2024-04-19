// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Appearance,
  useColorScheme,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import AppNavigation, { HomeStackParamList } from "./src/navigation/Navigation";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./src/utils/functions";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./src/redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");
  const scheme = useColorScheme(); // Detects the theme

  const backgroundColor = scheme === "dark" ? "#000" : "#fff";
  const textColor = scheme === "dark" ? "#fff" : "#000";

  // const navigation =
  //   useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => setSplashVisible(false));
  }, []);

  useEffect(() => {
    registerForNotifications();
    // notificationResponseListener();
  }, []);

  const registerForNotifications = async () => {
    await registerForPushNotificationsAsync()
      .then((token: string | undefined) => {
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  };

  // const notificationResponseListener = () => {
  //   Notifications.addNotificationResponseReceivedListener((response) => {
  //     const { data } = response.notification.request.content;
  //     const issueId = data.issueId;
  //     // Assuming you have a navigator with a 'navigate' method
  //     // You might need to adjust this depending on your navigation setup
  //     // This example assumes you're using a ref to your navigation container
  //     navigation.navigate("ProjectIssues", {
  //       projectName: data.projectName,
  //       data: data,
  //     });
  //     console.log("Notification data", data);
  //     console.log("Issue ID", issueId);
  //   });
  // };

  if (isSplashVisible) {
    return (
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeAnim,
          backgroundColor,
        }}>
        <Image
          source={require("./assets/icon.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ fontSize: 24 }}>SCOUT</Text>
      </Animated.View>
    );
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor }}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <AppNavigation />
      </View>
    </Provider>
  );
}
