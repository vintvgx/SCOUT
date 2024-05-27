import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";

const SkeletonLoader = () => {
  return (
    <View style={styles.skeletonContainer}>
      {/* <MotiView
        style={styles.skeletonItem}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
      />
      <MotiView
        style={[styles.skeletonItem, styles.skeletonText]}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
      />
      <MotiView
        style={[styles.skeletonItem, styles.skeletonText]}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
      /> */}
      <MotiView
        style={[styles.skeletonItem, styles.skeletonMap]}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 20,
  },
  skeletonItem: {
    backgroundColor: "#2C2C2E",
    borderRadius: 4,
    marginBottom: 10,
  },
  skeletonText: {
    height: 20,
    width: "80%",
  },
  skeletonMap: {
    height: 100,
    width: "100%",
  },
});

export default SkeletonLoader;
