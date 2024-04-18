import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PulseLight } from "./PulseLight";
import { Project } from "../model/project";

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const getIcon = () => {
    // Custom logic to display an appropriate icon based on the project platform
    return project.platform === "javascript-react" ? (
      <Ionicons name="logo-react" size={24} color="#BB86FC" /> // color="#4A90E2"
    ) : (
      <Ionicons name="phone-portrait-outline" size={24} color="#4A90E2" />
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.projectContainer}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}>
        <Text style={styles.projectName}>{project.name}</Text>
      </View>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.statusContainer}>
        {project.serverStatus ? (
          <>
            <Text style={styles.status}>
              {project.serverStatus === "live" ? "Online" : "Offline"}
            </Text>
            <PulseLight />
          </>
        ) : (
          <ActivityIndicator size="small" color="#4A90E2" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectContainer: {
    // backgroundColor: "rgb(44, 44, 46, 0.8)",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    height: 70,
  },
  iconContainer: {
    marginRight: 10,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    // color: "#333",
    color: "#FFFFFF",
    flex: 1, // Takes up remaining space
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Aligns status to the right
  },
  status: {
    fontSize: 16,
    // color: "#333",
    color: "#FFFFFF",
    marginRight: 5,
  },
});

export default ProjectCard;
