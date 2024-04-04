import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerForPushNotificationsAsync } from "../utils/functions";
import { AppDispatch, useAppSelector } from "../redux/store";
import {
  checkServerStatus,
  fetchIssues,
  fetchProjects,
} from "../redux/slices/ProjectsSlice";
import format from "pretty-format";
import { StatusBar } from "expo-status-bar";
import { PulseLight } from "../components/PulseLight";
import Header from "../components/Header";

const Home = () => {
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  const dispatch: AppDispatch = useDispatch();
  const { projects, projectsLoading } = useAppSelector((state) => state.issues);
  // console.log("🚀 ~ Home ~ projects:", format(projects));

  useEffect(() => {
    // Assuming fetchProjects action resolves when projects are successfully fetched
    dispatch(fetchProjects())
      .then((action) => {
        // Check if action is successful before checking server status
        if (fetchProjects.fulfilled.match(action)) {
          // Now that projects are fetched, dispatch checkServerStatus
          // Make sure checkServerStatus action is correctly implemented to handle an array of projects
          dispatch(checkServerStatus(action.payload));
        }
      })
      .catch((error) => {
        console.error(
          "Failed to fetch projects or check server status:",
          error
        );
      });
  }, [dispatch]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token: string | undefined) => {
        // console.log(token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const onRefresh = () => {
    dispatch(fetchProjects());
  };

  const openLink = (url: any) => {
    Linking.canOpenURL(url).then((supported: any) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  //TODO - Place SCOUT logo in the header

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <StatusBar style="light" />
      <Header />
      <ScrollView
        style={{ marginTop: 15 }}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={projectsLoading} onRefresh={onRefresh} />
        }>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => {
              // Log the project ID and project name here
              console.log(
                `Project ID: ${project.id}, Project Name: ${project.name}`
              );

              navigation.navigate("ProjectIssues", {
                projectId: project.id,
                projectName: project.name,
              });
            }}
            style={styles.projectContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.projectName}>{project.name}</Text>
              {/* Example of additional project information */}
              <Text style={styles.projectInfo}>Description: {project.id}</Text>
              <Text style={styles.projectInfo}>
                Open Issues: {project.platform}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {project.serverStatus ? (
                <>
                  <Text
                    style={{
                      color: project.serverStatus === "live" ? "#FFF" : "#FFF",
                      marginRight: 5,
                    }}>
                    {project.serverStatus === "live"
                      ? "Server Live"
                      : "Server Down"}
                  </Text>
                  <PulseLight />
                </>
              ) : (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212", // Dark background for the container
  },
  // Removing header style as it seems to be unused
  issueContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#242424", // Slightly lighter dark shade for contrast against the container
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF", // White text for dark theme
  },
  link: {
    marginTop: 10,
    color: "#1E90FF", // Bright blue for links, for better visibility on dark background
  },
  projectContainer: {
    backgroundColor: "#2C2C2E", // Dark background for project cards
    borderRadius: 10, // Rounded corners for a modern look
    padding: 15, // Inner spacing
    marginBottom: 10, // Space between project cards
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Elevation for Android
    flexDirection: "row", // Layout children in a row
    alignItems: "center", // Align items vertically
  },
  projectName: {
    fontSize: 18, // Text size
    fontWeight: "bold", // Text weight
    color: "#FFF", // White text color for readability
    flex: 1, // Take up available space
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  liveLight: {
    backgroundColor: "green",
  },
  downLight: {
    backgroundColor: "red",
  },
  projectInfo: {
    color: "#B0B0B0", // Lighter text color for additional info
    fontSize: 14, // Smaller font size than the project name
    marginTop: 2, // Space out the information vertically
  },
});
