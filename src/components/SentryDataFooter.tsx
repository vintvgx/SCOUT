import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppSelector } from "../redux/store";

interface SentryDataFooterProps {
  projectName: string;
}

const SentryDataFooter: React.FC<SentryDataFooterProps> = ({ projectName }) => {
  const { projects, newIssues } = useAppSelector((state) => state.issues);
  const project = projects.find((p) => p.name === projectName);
  const issues = project?.issues || [];
  const errors = project?.errors || [];

  return (
    <LinearGradient
      colors={["#1E1E1E", "#202020"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.issueText}>
          Issues: <Text style={styles.valueText}>{issues.length}</Text>
        </Text>
        <Text style={styles.issueText}>
          Errors: <Text style={styles.valueText}>{errors.length}</Text>
        </Text>
        <Text style={styles.issueText}>
          New Issues: <Text style={styles.valueText}>{newIssues.length}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SentryDataFooter;

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingHorizontal: 16,
    // borderRadius: 16,
    overflow: "hidden",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
  },
  issueText: {
    color: "#B3B3B3",
    fontSize: 14,
    marginVertical: 2,
  },
  valueText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
