import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProjectOptionModalProps {
  projectName: string;
  isProjectModalVisible: boolean;
  setProjectModalVisible: (visible: boolean) => void;
  onClose: () => void;
  fetchArchives: boolean;
}

const ProjectOptionModal: React.FC<ProjectOptionModalProps> = ({
  projectName,
  isProjectModalVisible,
  setProjectModalVisible,
  onClose,
  fetchArchives,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isProjectModalVisible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View>
          <Text>Project Options</Text>
          <Text>Project Name: {projectName}</Text>
          <View>
            <MaterialCommunityIcons name="archive" size={24} color="black" />
            <Text>Fetch Archives</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProjectOptionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
