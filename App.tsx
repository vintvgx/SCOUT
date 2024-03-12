// App.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Animated, SafeAreaView } from "react-native";
import AppNavigation from "./src/navigation/Navigation";
import { StatusBar } from "expo-status-bar";
import { getFcmToken, registerListenerWithFCM } from "./src/utils/FCM";

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = new Animated.Value(1); // Initial opacity for splash screen

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => setSplashVisible(false));
  }, []);

  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
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
        <Text style={{ fontSize: 24 }}>DPD.STATS</Text>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <AppNavigation />
    </SafeAreaView>
  );
}
