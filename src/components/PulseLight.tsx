import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

// Other imports remain unchanged...

export const PulseLight = () => {
  const animatedValue = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1250,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.light,
        styles.liveLight,
        {
          opacity: animatedValue,
          transform: [{ scale: animatedValue }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  // Other styles remain unchanged...
  light: {
    width: 6, // Adjusted to match the CSS example
    height: 6,
    borderRadius: 3, // Rounded corners for the light
    backgroundColor: "green", // You might already have this or similar
    marginLeft: 5,
    // position: "absolute",
    // left: 4,
    // top: 8,
  },
  liveLight: {
    // Your liveLight styles...
  },
  // Add any other styles you need...
});
