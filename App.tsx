// App.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Animated, SafeAreaView, Image } from "react-native";
import AppNavigation from "./src/navigation/Navigation";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./src/utils/functions";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./src/redux/store";

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => setSplashVisible(false));
  }, []);

  if (isSplashVisible) {
    return (
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeAnim,
        }}>
        <Image
          source={require("./assets/icon.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{ fontSize: 24, fontFamily: "Arial-bold" }}>SCOUT</Text>
      </Animated.View>
    );
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar style="light" />
        <AppNavigation />
      </View>
    </Provider>
  );
}
