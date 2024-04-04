import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>SCOUT</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    height: 60, // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Match the app's theme or choose a contrasting color
  },
  headerText: {
    fontSize: 20, // Adjust the size as needed
    fontWeight: "bold",
    color: "white", // Choose a color that fits your app's theme
  },
});
