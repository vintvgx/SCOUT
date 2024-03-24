// ProjectIssues.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import IssueCard from "../components/IssueCard";
import { Issue } from "../model/issue";

const ProjectIssues = ({ route }: { route: any }) => {
  const { projectId, projectName } = route.params;
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("errors");

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

  // const filteredIssues = (level: string) => {
  //   // Convert both values to lowercase to ensure case-insensitive comparison
  //   return issues.filter(
  //     (issue: { level: string }) =>
  //       issue.level.toLowerCase() === level.toLowerCase()
  //   );
  // };

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  const filteredIssues = (level: string) => {
    return issues.filter((issue) => issue.level === level);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{projectName} - Issues</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "errors" && styles.activeTab]}
            onPress={() => setActiveTab("errors")}>
            <Text style={styles.tabText}>Errors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "info" && styles.activeTab]}
            onPress={() => setActiveTab("info")}>
            <Text style={styles.tabText}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>Error fetching issues: {error}</Text>
        ) : null}
        {activeTab === "errors" &&
          filteredIssues("error").map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              onPress={() => console.log("Pressed issue", issue)}
            />
          ))}
        {activeTab === "info" &&
          filteredIssues("info").map((issue, index) => (
            <IssueCard
              key={index}
              issue={issue}
              onPress={() => console.log("Pressed issue", issue)}
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    backgroundColor: "#2D2D2D", // A slightly different background color for tabs
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow effect
  },
  activeTab: {
    backgroundColor: "#4A90E2", // A distinct color for the active tab
  },
  tabText: {
    color: "#FFFFFF", // Ensuring text is visible
    fontWeight: "bold",
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
