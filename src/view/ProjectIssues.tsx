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
import { SentryItem } from "../model/issue";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ErrorsScreen } from "../components/Errors";
import { IssuesScreen } from "../components/IssuesScreen";
import { AppDispatch, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { fetchIssues } from "../redux/slices/ProjectsSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/Navigation";

const Tab = createMaterialTopTabNavigator();

const ProjectIssues = ({ route }: { route: any }) => {
  const { projectId, projectName } = route.params;

  const dispatch: AppDispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  useEffect(() => {
    dispatch(fetchIssues(projectName));
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={15} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>{projectName}</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#555",
          tabBarIndicatorStyle: {
            backgroundColor: "#BB86FC",
          },
          tabBarPressColor: "#4A90E2",
          tabBarStyle: { backgroundColor: "#121212" },
        }}>
        <Tab.Screen
          name="Issues"
          children={() => <IssuesScreen projectId={projectId} />}
        />
        <Tab.Screen
          name="Errors"
          children={() => <ErrorsScreen projectId={projectId} />}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // Ensures the background color fills the whole screen
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the title container
    padding: 20,
    backgroundColor: "#121212",
    position: "relative", // Enable absolute positioning for children
  },
  backButton: {
    position: "absolute", // Position absolutely to appear on the left
    left: 20, // Distance from the left edge
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

export default ProjectIssues;
