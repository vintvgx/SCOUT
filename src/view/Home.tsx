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
import { StatusBar } from "expo-status-bar";
import { PulseLight } from "../components/PulseLight";
import Header from "../components/Header";
import axios from "axios";

const Home = () => {
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { projects, projectsLoading } = useAppSelector((state) => state.issues);

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
  }, [dispatch]);

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const onRefresh = () => {
    dispatch(fetchProjects());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
        <StatusBar style="light" />
        <Header />
        <Header />
        <ScrollView
          style={{ marginTop: 15 }}
          style={{ marginTop: 15 }}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={projectsLoading}
              onRefresh={onRefresh}
            />
          }>
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              onPress={() => {
                navigation.navigate("ProjectIssues", {
                  projectName: project.name,
                });
              }}
              style={styles.projectContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectInfo}>
                  Description: {project.id}
                </Text>
                <Text style={styles.projectInfo}>
                  Open Issues: {project.platform}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {project.serverStatus ? (
                  <>
                    <Text
                      style={{
                        color:
                          project.serverStatus === "live" ? "#FFF" : "#FFF",
                        marginRight: 5,
                      }}>
                      {project.serverStatus === "live" ? "Online" : "Offline"}
                      {project.serverStatus === "live" ? "Online" : "Offline"}
                    </Text>
                    <PulseLight />
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
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    backgroundColor: "#121212",
  },
  projectContainer: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
  },
  projectInfo: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 2,
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 2,
  },
});
