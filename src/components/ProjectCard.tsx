import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PulseLight } from "./PulseLight";
import { Project } from "../model/project";
import { useAppSelector } from "../redux/store";

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  // const scheme = useColorScheme();
  const scheme = "dark";
  const getIconColor = () => (scheme === "dark" ? "#BB86FC" : "#BB86FC");
  const { projects } = useAppSelector((state) => state.issues);
  let issues = project?.issues || [];
  let errors = project?.errors || [];

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={{ alignSelf: "flex-start" }}>
          <Text style={styles.projectName}>{project.name}</Text>
        </View>
        <View style={styles.iconAndStatusContainer}>
          <Ionicons
            name={
              project.platform === "javascript-react"
                ? "logo-react"
                : "phone-portrait-outline"
            }
            size={24}
            color={getIconColor()}
            style={styles.icon}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.textContainer}>
            {/* <Text style={styles.issuesText}>Issues {issues.length}</Text>
            <Text style={styles.errorsText}>Errors {errors.length}</Text> */}
            <Text style={styles.lastUpdatedText}>
              {/* Last Updated: {project.lastUpdated} */}
              Last Updated: April 24, 2024 10:23 AM
            </Text>
          </View>
          <View style={styles.iconAndStatusContainer}>
            <View style={styles.statusContainer}>
              {project.serverStatus ? (
                <>
                  <Text style={styles.statusText}>
                    {project.serverStatus === "live" ? "Online" : "Offline"}
                  </Text>
                  <PulseLight />
                </>
              ) : (
                <ActivityIndicator size="small" color={getIconColor()} />
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  cardContainer: {
    backgroundColor: "#333333",
    borderRadius: 10,
    padding: 15,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 120,
  },
  textContainer: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  issuesText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  errorsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  lastUpdatedText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
  },
  iconAndStatusContainer: {
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 5,
  },
  platformText: {
    fontSize: 16,
    color: "#BB86FC", // Adjust color for better visibility and style
    marginBottom: 5,
  },
  icon: {
    marginHorizontal: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 5,
  },
});

export default ProjectCard;
