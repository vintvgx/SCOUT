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

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const scheme = useColorScheme();

  // Define styles based on theme
  const cardStyle = {
    backgroundColor: scheme === "dark" ? "#2C2C2E" : "#f2f2f2", // Dark grey or light grey
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: scheme === "dark" ? "#000000" : "#999999", // Black or lighter grey shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: scheme === "dark" ? 0.25 : 0.15,
    shadowRadius: 5,
    elevation: 10,
    borderColor: "rgb( 0, 0, 0, 0.2",
    borderWidth: 0.2,
    // flexDirection: "row",
    // alignItems: "center",
    height: 70,
  };

  const textStyle = {
    fontSize: 20,
    color: scheme === "dark" ? "#FFFFFF" : "#333333", // White or dark grey
    flex: 1,
  };

  const statusTextStyle = {
    fontSize: 16,
    color: scheme === "dark" ? "#FFFFFF" : "#333333", // White or dark grey
    marginRight: 5,
  };

  const getIconColor = () => (scheme === "dark" ? "#BB86FC" : "#BB86FC"); // Purple or blue

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[cardStyle, { flexDirection: "row", alignItems: "center" }]}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}>
        <Text style={{ ...textStyle, fontWeight: "bold" }}>{project.name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons
          name={
            project.platform === "javascript-react"
              ? "logo-react"
              : "phone-portrait-outline"
          }
          size={24}
          color={getIconColor()}
        />
      </View>
      <View style={styles.statusContainer}>
        {project.serverStatus ? (
          <>
            <Text style={statusTextStyle}>
              {project.serverStatus === "live" ? "Online" : "Offline"}
            </Text>
            <PulseLight />
          </>
        ) : (
          <ActivityIndicator size="small" color={getIconColor()} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default ProjectCard;
