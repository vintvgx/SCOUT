import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SentryItem } from "../model/issue";
import { useAppSelector } from "../redux/store";

interface SentryDataFooterProps {
  projectName: string;
}

const SentryDataFooter: React.FC<SentryDataFooterProps> = ({ projectName }) => {
  const { projects, loading, error, newIssues } = useAppSelector(
    (state) => state.issues
  );

  const project = projects.find((p) => p.name === projectName); // Ensure the project is defined and has issues

  let issues = project?.issues || [];
  let errors = project?.errors || [];

  return (
    <View style={styles.container}>
      <Text style={styles.issueText}>Total Issues: {issues.length}</Text>
      <Text style={styles.issueText}>Total Errors: {errors.length}</Text>
      <Text style={styles.issueText}>New Issues: {newIssues.length}</Text>
    </View>
  );
};

export default SentryDataFooter;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#525252",
    height: 40,
  },
  issueText: {
    color: "white",
  },
});
