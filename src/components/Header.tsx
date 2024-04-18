import { StyleSheet, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value of 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Make the animation last for 2000ms
      useNativeDriver: true, // Add this line
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.headerContainer}>
      <Animated.Text style={[styles.headerText, { opacity: fadeAnim }]}>
        SCOUT
      </Animated.Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "300",
    color: "white",
    textShadowColor: "rgba(255, 255, 255, 1)",
    // textShadowOffset: { width: -1, height: -1 },
    // textShadowRadius: 4,
    letterSpacing: 10,
    marginTop: 10,
  },
});

// headerContainer: {
//     height: 60, // Adjust the height as needed
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white", // Match the app's theme or choose a contrasting color
//     width: 60,
//     alignSelf: "center",
//     borderRadius: 100,
//     padding: 10,
//     elevation: 5,
//   },
//   headerText: {
//     fontSize: 20, // Adjust the size as needed
//     fontWeight: "bold",
//     color: "white", // Choose a color that fits your app's theme
//   },
//   logo: {
//     width: 400, // Adjust based on your logo's size
//     height: 70, // Adjust based on your logo's size
//     resizeMode: "contain", // Ensures the logo is scaled correctly
//   },
//   <Image
//       source={require("/Users/vintvgx/Desktop/bandit.studios/studio.code/RN/dpd.stats/assets/icon.png")}
//       style={styles.logo}
//     />
