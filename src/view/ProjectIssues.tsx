// ProjectIssues.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import IssueCard from "../components/IssueCard";

const ProjectIssues = ({ route }: { route: any }) => {
  const { projectId, projectName } = route.params;
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = async () => {
    setRefreshing(true); // Enable the refreshing indicator
    try {
      const response = await axios.get(
        `https://sentry.io/api/0/projects/communite/${projectName}/issues/`,
        {
          headers: {
            Authorization:
              "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
          },
        }
      );
      setIssues(response.data);
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setRefreshing(false); // Disable the refreshing indicator
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{projectName} - Issues</Text>
      </View>
      <ScrollView style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>Error fetching issues: {error}</Text>
        ) : null}
        {issues.map((issue, index) => (
          <IssueCard
            key={index}
            issue={issue}
            onPress={() => {
              console.log("Pressed issue", issue);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Ensures the background color fills the whole screen
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#121212", // Match the main background
  },
  errorText: {
    color: "#FFFFFF", // Ensuring error text is also visible against the dark background
    marginBottom: 20, // Adds some space before the list of issues starts
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212", // Dark background for the main view
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF", // White text for contrast against the dark background
  },
  // Removed the issueContainer style as it seems to be unused in favor of IssueCard component
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Ensuring the issue titles also contrast wells
  },
});

export default ProjectIssues;
