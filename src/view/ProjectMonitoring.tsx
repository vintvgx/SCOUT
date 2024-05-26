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
  useColorScheme,
} from "react-native";
import IssueCard from "../components/IssueCard";
import { SentryItem } from "../model/issue";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SentryErrorsView } from "../components/SentryErrors";
import { SentryIssuesView } from "../components/SentryIssues";
import { AppDispatch, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import {
  fetchArchivedSentryIssues,
  fetchSentryIssues,
  fetchSentryIssuesWithLocation,
  resetLoadedData,
} from "../redux/slices/SentryDataSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/Navigation";
import SentryIssuesAndErrors from "../components/SentryIssuesAndErrors";
import SentryDataFooter from "../components/SentryDataFooter";

const Tab = createMaterialTopTabNavigator();

const ProjectMonitoringView = ({ route }: { route: any }) => {
  // const scheme = useColorScheme();
  const scheme = "dark";
  const { data, projectName } = route.params;
  const { projects, loading } = useAppSelector((state) => state.issues);

  const project = projects.find((p) => p.name === projectName);

  const issuesTitle = `Issues (${project?.issues.length || 0})`;
  const errorsTitle = `Errors (${project?.errors.length || 0})`;

  const dispatch: AppDispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [displayArchives, setDisplayArchives] = useState<boolean>(false);

  // Fetch issue details by ID if issueId is present in the navigation parameters
  // useEffect(() => {
  //   if (data) {
  //     console.log("DATA INCLUDED: FETCHING ISSUES FOR PROJECT", projectName);
  //     console.log("DATA:", data);
  //     dispatch(resetLoadedData(projectName));
  //     dispatch(fetchSentryIssues(projectName)).catch((error) =>
  //       console.error("Failed to fetch issue details:", error)
  //     );
  //   } else {
  //     console.log("FETCHING ISSUES FOR PROJECT", projectName);
  //     dispatch(fetchSentryIssues(projectName));
  //   }
  // }, [dispatch, data]);

  useEffect(() => {
    if (project && displayArchives) {
      console.log("FETCHING ISSUES FOR PROJECT", projectName);
      dispatch(fetchArchivedSentryIssues(projectName));
    }
  }, [displayArchives]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: scheme === "dark" ? "#121212" : "#FFFFFF",
        flex: 1,
      }}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: scheme === "dark" ? "#121212" : "#FFF" },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={20}
            color={scheme === "dark" ? "#FFF" : "#000"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.header,
            { color: scheme === "dark" ? "#FFFFFF" : "#000000" },
          ]}>
          {projectName}
        </Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <SentryIssuesAndErrors projectName={projectName} data={data} />
      <SentryDataFooter projectName={projectName} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Center the title container
    padding: 20,
    position: "relative", // Enable absolute positioning for children
  },
  backButton: {
    // position: "absolute", // Position absolutely to appear on the left
    // left: 10, // Distance from the left edge
    // padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center", // Ensure the text is centered
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#fff", // Match the main background
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
  // Removed the issueContainer style as it seems to be unused in favor of IssueCard component
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Ensuring the issue titles also contrast wells
  },
});

export default ProjectMonitoringView;
