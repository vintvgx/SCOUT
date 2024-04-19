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
  Animated,
  useColorScheme,
} from "react-native";
import { LocationData, SentryEvent } from "../model/event";
import format from "pretty-format";
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
  const scheme = useColorScheme();
  const animationValue = new Animated.Value(0);
  const [selectedEvent, setSelectedEvent] = useState<SentryEvent | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleInfoIconPress = (event: SentryEvent) => {
    setSelectedEvent(event);
    setInfoModalVisible(true);
  };

  const modalContainerStyle = {
    ...styles(scheme).modalContainer,
    opacity: animationValue,
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  const renderMapView = (event: SentryEvent) => {
    if (event?.location?.status === "success") {
      return (
        <View style={styles(scheme).mapContainer}>
          <MapView
            style={styles(scheme).map}
            initialRegion={{
              latitude: event.location.lat,
              longitude: event.location.lon,
              latitudeDelta: INITIAL_REGION.latitudeDelta,
              longitudeDelta: INITIAL_REGION.longitudeDelta,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}>
            <Marker
              coordinate={{
                latitude: event.location.lat,
                longitude: event.location.lon,
              }}
              title={event.title}
              description={event.message}
            />
          </MapView>
          <Text style={styles(scheme).cityStateLocation}>
            {event.location?.city}, {event.location?.region}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles(scheme).mapContainer}>
          <MapView
            style={styles(scheme).mapUnknown}
            initialRegion={INITIAL_REGION}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
          />
          <Text style={styles(scheme).unknownLocationText}>
            Unknown Location
          </Text>
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles(scheme).modalBackdrop}>
        <Animated.View style={modalContainerStyle}>
          <View style={styles(scheme).header}>
            <Text style={styles(scheme).headerTitle}>
              {events.length > 0 ? events[0].title : "Event"}
            </Text>
          </View>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}>
            {events.map((event, index) => (
              <View key={index} style={styles(scheme).eventContainer}>
                <View style={styles(scheme).tagIcon}>
                  <TouchableOpacity onPress={() => handleInfoIconPress(event)}>
                    <Icon
                      name="information-circle-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles(scheme).sectionHeader}>EVENT</Text>
                <Text style={styles(scheme).id}>ID: {event.id}</Text>
                <Text style={styles(scheme).date}>
                  {formatDate(event.dateCreated)}
                </Text>
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles(scheme).sectionHeader}>User</Text>
                  <Text style={styles(scheme).sectionContent}>
                    {event.user.email
                      ? event.user.email
                      : event.user?.ip_address}
                  </Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles(scheme).sectionHeader}>URL</Text>
                  <Text style={styles(scheme).sectionContent}>
                    {event.culprit}
                  </Text>
                </View>
                {renderMapView(event)}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles(scheme).closeButton}
            onPress={onClose}>
            <Text style={styles(scheme).closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
        {selectedEvent && (
          <EventInformation
            infoModalVisible={infoModalVisible}
            setInfoModalVisible={setInfoModalVisible}
            selectedEvent={selectedEvent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = (scheme: any) =>
  StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(200, 200, 200, 0.8)",
    },
    modalContainer: {
      maxHeight: Dimensions.get("window").height * 0.8,
      width: Dimensions.get("window").width * 0.9,
      backgroundColor: scheme === "dark" ? "#121212" : "#FFFFFF",
      borderRadius: 10,
      alignContent: "center",
      justifyContent: "center",
      elevation: 20,
    },
    eventContainer: {
      alignItems: "flex-start",
      justifyContent: "center",
      width: Dimensions.get("window").width * 0.9,
      padding: 24,
    },
    header: {
      alignSelf: "stretch",
      backgroundColor: scheme === "dark" ? "#333" : "#EEE",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 10,
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 20,
    },
    tagIcon: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#6B46C1",
      padding: 8,
      borderRadius: 20,
    },
    id: {
      fontSize: 14,
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 10,
    },
    date: {
      fontSize: 16,
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 10,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: "600",
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      marginBottom: 5,
    },
    sectionContent: {
      fontSize: 16,
      color: scheme === "dark" ? "#CCCCCC" : "#333333",
    },
    mapContainer: {
      height: 200,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
    },
    map: {
      width: 300,
      height: 200,
      justifyContent: "center",
      alignSelf: "center",
      borderWidth: 1,
      borderRadius: 10,
    },
    mapUnknown: {
      width: 300,
      height: 200,
      justifyContent: "center",
      alignSelf: "center",
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: scheme === "dark" ? "#333" : "#DDD",
      opacity: 0.4,
    },
    closeButton: {
      alignSelf: "stretch",
      padding: 15,
      position: "relative",
      marginTop: 20,
    },
    closeButtonText: {
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
    cityStateLocation: {
      color: scheme === "dark" ? "#5a5a5a" : "#333333",
      fontSize: 16,
      marginTop: 20,
      textAlign: "center",
      alignSelf: "center",
    },
    unknownLocationText: {
      position: "absolute",
      top: "50%",
      width: "100%",
      textAlign: "center",
      color: scheme === "dark" ? "#FFFFFF" : "#000000",
      fontSize: 16,
      fontWeight: "bold",
      transform: [{ translateY: -8 }],
    },
  });

export default EventViewer;
