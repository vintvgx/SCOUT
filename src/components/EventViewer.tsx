import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { LocationData, SentryEvent } from "../model/event";
import format from "pretty-format";
import { fetchLocationForIP } from "../utils/functions";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import EventInformation from "./EventInformation";

interface EventViewerProps {
  isVisible: boolean;
  onClose: () => void;
  events: SentryEvent[]; // Expect an array of SentryEvent objects
}

const INITIAL_REGION = {
  latitude: 42.3601,
  longitude: -71.0589,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-indexed
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getUTCHours()}`.slice(-1);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  const timeOfDay = date.getHours() >= 12 ? "PM" : "AM";

  return `${month}.${day}.${year} ${hours}:${minutes}:${seconds} ${timeOfDay}`;
};

const EventViewer: React.FC<EventViewerProps> = ({
  events,
  isVisible,
  onClose,
}) => {
  const eventTitle = events.length > 0 ? events[0].title : "Event";

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SentryEvent | null>(null);

  const handleInfoIconPress = (event: SentryEvent) => {
    setSelectedEvent(event);
    setInfoModalVisible(true);
  };

  const handleScrollViewPress = () => {
    // Prevent the modal from closing when pressing within the ScrollView
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      {/* <TouchableWithoutFeedback onPress={onClose}> */}
      <View style={styles.modalBackdrop}>
        {/* This TouchableWithoutFeedback will only trigger if the inner content doesn't catch the touch */}
        {/* <TouchableWithoutFeedback> */}
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{eventTitle}</Text>
          </View>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}>
            {events.map((event, index) => (
              <View key={index} style={styles.eventContainer}>
                <View style={styles.tagIcon}>
                  <TouchableOpacity onPress={() => handleInfoIconPress(event)}>
                    <Icon
                      name="information-circle-outline"
                      size={24}
                      color="#BB86FC"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.sectionHeader}>EVENT</Text>
                <Text style={styles.id}>ID: {event.id}</Text>
                <Text style={styles.date}>{formatDate(event.dateCreated)}</Text>

                {/* {event.message && (
                  <Text style={styles.date}>{event.message}</Text>
                )} */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>User</Text>
                  <Text style={styles.sectionContent}>
                    {event.user?.ip_address}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>URL</Text>
                  <Text style={styles.sectionContent}>{event.culprit}</Text>
                </View>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude:
                      event.location?.address.latitude ||
                      INITIAL_REGION.latitude,
                    longitude:
                      event.location?.address.longitude ||
                      INITIAL_REGION.longitude,
                    latitudeDelta: INITIAL_REGION.latitudeDelta,
                    longitudeDelta: INITIAL_REGION.longitudeDelta,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}>
                  <Marker
                    coordinate={{
                      latitude:
                        event.location?.address.latitude ||
                        INITIAL_REGION.latitude,
                      longitude:
                        event.location?.address.longitude ||
                        INITIAL_REGION.longitude,
                    }}
                    title={event.title}
                    description={event.message}
                  />
                </MapView>
                <Text style={styles.cityStatelocation}>
                  {event.location?.address.city},{" "}
                  {event.location?.address.state}
                </Text>
                <View style={styles.eventCounter}>
                  <Text style={styles.eventCounterText}>{`${index + 1}/${
                    events.length
                  }`}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        {/* </TouchableWithoutFeedback> */}
        {selectedEvent && (
          <EventInformation
            infoModalVisible={infoModalVisible}
            setInfoModalVisible={setInfoModalVisible}
            selectedEvent={selectedEvent}
          />
        )}
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  );
};

// ... (rest of the code remains the same)

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 200, 200, 0.8)",
  },
  modalContainer: {
    maxHeight: screen.height * 0.8,
    width: screen.width * 0.9,
    backgroundColor: "#121212",
    borderRadius: 10,
    // borderBottomEndRadius: 50,
    // borderBottomStartRadius: 50,
    alignContent: "center",
    justifyContent: "center",
    elevation: 20,
  },
  eventContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: screen.width * 0.9,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  header: {
    alignSelf: "stretch",
    backgroundColor: "#333", // Dark background for the header
    borderTopLeftRadius: 10, // Match the modal's border radius
    borderTopRightRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  tagIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  // headerTitle: {
  //   fontSize: 22,
  //   fontWeight: "bold",
  //   color: "#fff", // White text color
  //   textAlign: "center",
  // },
  id: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  tagDetail: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  closeButton: {
    alignSelf: "stretch",
    // backgroundColor: "#b3b2b1",
    padding: 15,
    // borderRadius: 5,
    // marginTop: 20,
    position: "relative",
    // borderBottomEndRadius: 50,
    // borderBottomStartRadius: 50,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  mapContainer: {
    height: 200, // Adjust based on your preference
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  map: {
    width: 300,
    height: 200,
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  eventCounter: {
    justifyContent: "center",
    // backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  eventCounterText: {
    color: "#000",
  },
  cityStatelocation: {
    color: "#5a5a5a",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    alignSelf: "center",
  },
});

export default EventViewer;
