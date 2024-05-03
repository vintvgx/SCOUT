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
  Button,
  useColorScheme,
} from "react-native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/Navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerForPushNotificationsAsync } from "../utils/functions";
import { AppDispatch, useAppSelector } from "../redux/store";
import {
  addNewIssueID,
  checkServerStatus,
  fetchProjects,
} from "../redux/slices/ProjectsSlice";
import { StatusBar } from "expo-status-bar";
import { PulseLight } from "../components/PulseLight";
import Header from "../components/Header";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import format from "pretty-format";
import * as Sentry from "@sentry/react-native";

const Home = () => {
  const scheme = useColorScheme();
  const backgroundColor = scheme === "dark" ? "#222" : "#fff";

  const dispatch: AppDispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { projects, projectsLoading } = useAppSelector((state) => state.issues);
  const { expoPushToken } = useAppSelector((state) => state.register);
  const [displayNotification, setDisplayNotification] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects())
      .then((action) => {
        if (fetchProjects.fulfilled.match(action)) {
          dispatch(checkServerStatus(action.payload));
        }
      })
      .catch((error) => {
        console.error(
          "Failed to fetch projects or check server status:",
          error
        );
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { data } = response.notification.request.content;

        if (data.issueId) {
          // Dispatch an action to mark this issue as new
          dispatch(addNewIssueID([data.issueId]));
        }

        console.log(
          "🚀 ~ HOME ~ notification response listener (issueId):",
          data.issueId
        );

        navigation.navigate("ProjectIssues", {
          projectName: data.projectName,
          data: data,
        });
      }
    );

    // Cleanup
    return () => subscription.remove();
  }, [dispatch, navigation]);

  const onRefresh = () => {
    dispatch(fetchProjects());
  };

  const sendNotification = async () => {
    console.log("Sending notification");
    console.log("Expo Push Token:", expoPushToken);
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title2",
      body: "ISSA TEST!",
      data: {
        title: "Original Title2",
        body: expoPushToken,
        _displayInForeground: true,
      },
    };
    console.log("Message:", format(message));
    try {
      await axios
        .post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response:", response.data);
          Sentry.captureMessage("Push Notification sent successfully");
        });
    } catch (err: any) {
      console.error("POST Push Notification err:", err.message);
      Sentry.captureException(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <Header
          onPress={() => setDisplayNotification((prevState) => !prevState)}
        />

        <ScrollView
          style={{ marginTop: 15 }}
          contentContainerStyle={[styles.container, { backgroundColor }]}
          refreshControl={
            <RefreshControl
              refreshing={projectsLoading}
              onRefresh={onRefresh}
            />
          }>
          {projects
            .filter(
              (project) => project.name !== "scout" || displayNotification
            )
            .map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                onPress={() =>
                  navigation.navigate("ProjectIssues", {
                    projectName: project.name,
                  })
                }
              />
            ))}
        </ScrollView>
        {displayNotification && (
          <View>
            <Text>{expoPushToken}</Text>
            <Button title="Test Notification" onPress={sendNotification} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
