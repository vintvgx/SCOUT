import {
  StyleSheet,
  View,
  Animated,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

interface HeaderProps {
  onPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPress }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value of 0

  // const scheme = useColorScheme();
  const scheme = "dark";
  const backgroundColor = scheme === "dark" ? "#222" : "#fff";
  const color = scheme === "dark" ? "#fff" : "#000";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Make the animation last for 2000ms
      useNativeDriver: true, // Add this line
    }).start();
  }, [fadeAnim]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.headerContainer, { backgroundColor }]}>
      <Animated.Text style={[styles.headerText, { color, opacity: fadeAnim }]}>
        SCOUT
      </Animated.Text>
    </TouchableOpacity>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "300",
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
