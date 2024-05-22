// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Appearance,
  useColorScheme,
  Animated,
  Image,
} from "react-native";
import AppNavigation from "./src/navigation/Navigation";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./src/utils/functions";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "./src/redux/store";
import * as Sentry from "@sentry/react-native";
import { setExpoPushToken } from "./src/redux/slices/RegisterSlice";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Sentry.init({
  dsn: "https://528b0f80ff87e6b7af4e6b3321c27510@o4506865440849920.ingest.us.sentry.io/4507119672557568",
  debug: false,
  tracesSampleRate: 1.0,
});

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(1);
  // const scheme = useColorScheme();
  const scheme = "dark";

  const backgroundColor = scheme === "dark" ? "#000" : "#fff";
  const textColor = scheme === "dark" ? "#fff" : "#000";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => setSplashVisible(false));
  }, []);

  if (isSplashVisible) {
    return (
      <View style={{ flex: 1, backgroundColor: "#222" }}>
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            opacity: fadeAnim,
            backgroundColor: "#222",
          }}>
          <Image
            source={require("./assets/LOGO.png")}
            style={{ width: 150, height: 150 }}
          />
        </Animated.View>
      </View>
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
};

export default Sentry.wrap(App);
function useAppDispatch() {
  throw new Error("Function not implemented.");
}
