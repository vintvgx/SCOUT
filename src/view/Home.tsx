import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format as prettyFormat } from "pretty-format";
import { Project, SentryIssue } from "../model/issue";
import IssueCard from "../components/IssueCard";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  registerForPushNotificationsAsync,
  sendNotification,
} from "../utils/functions";

const Home = () => {
  const [issues, setIssues] = useState<SentryIssue[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token: string | undefined) => {
        console.log(token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const fetchIssues = async () => {
    setRefreshing(true); // Enable the refreshing indicator
    try {
      const response = await axios.get(
        "https://sentry.io/api/0/projects/communite/portfolio/issues/",
        {
          headers: {
            Authorization:
              "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
          },
        }
      );
      setIssues(response.data);
      console.log("🚀 ~ fetchIssues ~ data:", prettyFormat(response.data));
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setRefreshing(false); // Disable the refreshing indicator
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://sentry.io/api/0/organizations/communite/projects/",
        {
          headers: {
            Authorization:
              "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
          },
        }
      );
      setProjects(response.data);
      console.log("Projects:", prettyFormat(response.data));
    } catch (err: any) {
      setError(err.message);
      console.error("GET Projects err:", err.message);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchProjects();
  }, []);

  const onRefresh = () => {
    fetchIssues(); // Call fetchIssues when the user initiates a refresh
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

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView
        style={{ marginTop: 50 }}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {error ? <Text>Error fetching issues: {error}</Text> : null}
        {projects.map((project: Project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() =>
              navigation.navigate("ProjectIssues", {
                projectId: project.id,
                projectName: project.name,
              })
            }
            style={styles.projectContainer}>
            <Text style={styles.projectName}>{project.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <Button
        title="Send Notification"
        onPress={() => sendNotification(expoPushToken)}
        color="#1E90FF"
      /> */}
    </View>
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
});
