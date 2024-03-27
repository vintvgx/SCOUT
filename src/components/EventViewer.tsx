import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Modal } from "native-base";
import { Button } from "native-base";
import { SentryEvent } from "../model/event";

interface EventViewerProps {
  isVisible: boolean;
  onClose: () => void;
  events: SentryEvent[]; // Expect an array of SentryEvent objects
}

const EventViewer: React.FC<EventViewerProps> = ({
  events,
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      // animationType="slide"
      // transparent={false}
      // visible={isVisible}

      isOpen={isVisible}
      onClose={onClose}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}>
        {events.map((event, index) => (
          <View key={index} style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetail}>
              Date Created: {event.dateCreated}
            </Text>
            <Text style={styles.eventDetail}>Message: {event.message}</Text>
            {/* Map over the tags if necessary */}
            {event.tags.map((tag, tagIndex) => (
              <Text key={tagIndex} style={styles.tagDetail}>
                {tag.key}: {tag.value}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    width: Dimensions.get("window").width, // Full width of the screen
    padding: 20,
    backgroundColor: "#fff", // White background for the event details
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark text color for the title
    marginBottom: 10,
  },
  eventDetail: {
    fontSize: 16,
    color: "#666", // Slightly lighter text color for details
    marginBottom: 5,
  },
  tagDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#007bff", // A blue background color for the close button
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  closeButtonText: {
    color: "#fff", // White text color for the button text
    fontSize: 16,
  },
});

export default EventViewer;
