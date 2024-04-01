import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SentryEvent } from "../model/event";
import { SentryItem } from "../model/issue";

interface MapViewModalProps {
  visible: boolean;
  onClose: () => void;
  issue: SentryItem | null;
}

const MapViewModal: React.FC<MapViewModalProps> = ({
  visible,
  onClose,
  issue,
}) => {
  if (!issue) return null; // Don't render if there's no issue

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalView}>
        <ScrollView>
          <Text style={styles.title}>{issue.title}</Text>
          <Text>Assigned To: {issue.assignedTo || "N/A"}</Text>
          <Text>Status: {issue.status}</Text>
          <Text>Priority: {issue.priority}</Text>
          <Text>Last Seen: {issue.lastSeen}</Text>
          {issue.events?.map((event: SentryEvent, index: any) => (
            <View key={index} style={styles.eventContainer}>
              <Text style={styles.eventTitle}>Event {index + 1}</Text>
              <Text>Message: {event.message}</Text>
              <Text>Date: {event.dateCreated}</Text>
              <Text>Platform: {event.platform}</Text>
            </View>
          ))}
          <Button title="Close" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default MapViewModal;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    height: Dimensions.get("window").height - 200,
    width: Dimensions.get("window").width - 50,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
