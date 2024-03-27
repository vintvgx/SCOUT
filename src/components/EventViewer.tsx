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
import MapView, { Marker } from "react-native-maps";
import { Button } from "native-base";
import { LocationData, SentryEvent } from "../model/event";
import format from "pretty-format";
import { fetchLocationForIP } from "../utils/functions";

interface EventViewerProps {
  isVisible: boolean;
  onClose: () => void;
  events: SentryEvent[]; // Expect an array of SentryEvent objects
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-indexed
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

const EventViewer: React.FC<EventViewerProps> = ({
  events,
  isVisible,
  onClose,
}) => {
  const [eventsWithLocation, setEventsWithLocation] = useState<SentryEvent[]>(
    []
  );

  useEffect(() => {
    const fetchLocationsAndSetEvents = async () => {
      const eventsWithLocationData = await Promise.all(
        events.map(async (event) => {
          if (event.user?.ip_address) {
            try {
              const locationResponse = await fetchLocationForIP(
                event.user.ip_address
              ); // Assume this returns the data in the format of the response above
              const locationData: LocationData = locationResponse; // Assuming fetchLocationForIP returns the data directly
              console.log(
                "🚀 ~ events.map ~ locationData:",
                format(locationData)
              );

              return { ...event, location: locationData };
            } catch (error) {
              console.error("Failed to fetch location:", error);
              return event; // Return the event unchanged if location fetch fails
            }
          }
          return event;
        })
      );

      setEventsWithLocation(eventsWithLocationData);
    };

    fetchLocationsAndSetEvents();
  }, [events]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}>
            {eventsWithLocation.map((event, index) => (
              <View key={index} style={styles.eventContainer}>
                {/* Event title as header */}
                <Text style={styles.header}>{event.title}</Text>
                {/* Formatted date */}
                <Text style={styles.date}>{formatDate(event.dateCreated)}</Text>
                {/* Section for user, URL, and message */}
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
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Message</Text>
                  <Text style={styles.sectionContent}>{event.message}</Text>
                  <Text>{event.location?.address?.latitude ?? "N/A"}</Text>
                  <Text>{event.location?.address?.longitude ?? "N/A"}</Text>
                </View>

                {event.tags.map((tag, tagIndex) => (
                  <Text key={tagIndex} style={styles.tagDetail}>
                    {tag.key}: {tag.value}
                  </Text>
                ))}
                <View style={styles.mapContainer}>
                  {event.location?.address.latitude &&
                    event.location.address.longitude && (
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: event.location?.address?.latitude,
                          longitude: event.location.address.longitude,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}>
                        <Marker
                          coordinate={{
                            latitude: event.location?.address?.latitude,
                            longitude: event.location.address.longitude,
                          }}
                          title={`${event.title}`}
                          description={`Location for IP: ${event.user?.ip_address}`}
                        />
                      </MapView>
                    )}
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    maxHeight: screen.height * 0.8,
    width: screen.width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  eventContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: screen.width * 0.81,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2a2a2a",
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: "#4a4a4a",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3a3a3a",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: "#5a5a5a",
  },
  tagDetail: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  closeButton: {
    alignSelf: "stretch",
    backgroundColor: "#707070",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
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
    ...StyleSheet.absoluteFillObject,
  },
});

export default EventViewer;
