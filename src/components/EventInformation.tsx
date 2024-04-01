import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView, // Add ScrollView for better handling of content
} from "react-native";
import { SentryEvent } from "../model/event";

interface EventInformationProps {
  infoModalVisible: boolean;
  setInfoModalVisible: (value: boolean) => void;
  selectedEvent: SentryEvent | null;
}

const EventInformation: React.FC<EventInformationProps> = ({
  infoModalVisible,
  setInfoModalVisible,
  selectedEvent,
}) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={() => setInfoModalVisible(false)}>
            <View style={styles.infoModalContainer}>
              <View style={styles.header}>
                <Text style={styles.infoHeader}>Event ID</Text>
                <Text style={styles.eventID}>{selectedEvent?.id}</Text>
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.tagsContainer}>
                  {selectedEvent?.tags.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                      <Text style={styles.tagKey}>{tag.key}</Text>
                      <Text style={styles.tagValue}>: {tag.value}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
};

export default EventInformation;

const styles = StyleSheet.create({
  header: {
    alignSelf: "stretch",
    backgroundColor: "black", // Dark background for the header
    borderTopLeftRadius: 10, // Match the modal's border radius
    borderTopRightRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  infoModalContainer: {
    backgroundColor: "white",
    // padding: 20,
    borderRadius: 10,
    maxHeight: "60%", // Set max height to 60% of the parent view
    width: "90%", // Adjust width as needed
    overflow: "hidden", // Ensure the content doesn't overflow
  },
  scrollViewContainer: {
    alignItems: "center", // Center the content
  },
  infoHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10, // Increase spacing
    alignSelf: "flex-start", // Align header to the left
    color: "white",
  },
  eventID: {
    fontSize: 16,
    color: "white",
  },
  tagsContainer: {
    flexDirection: "row", // Layout tags in a row
    flexWrap: "wrap", // Allow tags to wrap to next line
    justifyContent: "flex-start", // Center tags horizontally
    padding: 20,
  },
  tagItem: {
    flexDirection: "row", // Layout key-value pairs in a row
    backgroundColor: "#eee", // Light background for tag items
    borderRadius: 10, // Rounded corners for tag items
    padding: 8,
    margin: 4, // Margin around each tag for spacing
  },
  tagKey: {
    fontWeight: "bold",
  },
  tagValue: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});
