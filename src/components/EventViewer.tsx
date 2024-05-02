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
  ActivityIndicator,
} from "react-native";
import { Location, LocationData, SentryEvent } from "../model/event";
import format from "pretty-format";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import EventInformation from "./EventInformation";
import { DEFAULT_LOCATION, INITIAL_REGION } from "../utils/constants";
import { formatDate } from "../utils/functions";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { fetchLocationFromIP } from "../redux/slices/ProjectsSlice";

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
  const dispatch: AppDispatch = useDispatch();
  const scheme = useColorScheme();
  const animationValue = new Animated.Value(0);
  const [selectedEvent, setSelectedEvent] = useState<SentryEvent | null>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState<boolean>(false);
  // const [loadingLocations, setLoadingLocations] = useState<boolean[]>(
  //   new Array(events.length).fill(false)
  // );

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

  useEffect(() => {
    console.log("Fetching location");

    const fetchAndSetLocations = async () => {
      let allLocationsFetched = true;
      const promises = events.map(async (event) => {
        if (!event.location && event.user?.ip_address) {
          allLocationsFetched = false;
          return dispatch(fetchLocationFromIP(event.user.ip_address))
            .then((actionResult) => ({
              ...event,
              location: actionResult.payload,
            }))
            .catch(() => ({ ...event, location: DEFAULT_LOCATION }));
        }
        return event;
      });

      if (!allLocationsFetched) {
        setLoadingLocations(true);
        Promise.all(promises).then(() => {
          setLoadingLocations(false);
        });
      }
    };

    if (events.length > 0) {
      fetchAndSetLocations();
    }
  }, [events, dispatch]);

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

  const handleInfoIconPress = (event: SentryEvent) => {
    setSelectedEvent(event);
    setInfoModalVisible(true);
  };

  const renderMapView = (event: SentryEvent, index: number) => {
    const initialRegion = {
      latitude: INITIAL_REGION.latitude,
      longitude: INITIAL_REGION.longitude,
      latitudeDelta: INITIAL_REGION.latitudeDelta,
      longitudeDelta: INITIAL_REGION.longitudeDelta,
    };

    return (
      <View style={styles(scheme).mapContainer}>
        <MapView
          style={styles(scheme).map}
          initialRegion={
            event.location
              ? {
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                  latitudeDelta: INITIAL_REGION.latitudeDelta,
                  longitudeDelta: INITIAL_REGION.longitudeDelta,
                }
              : initialRegion
          }
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}>
          {event.location && (
            <Marker
              coordinate={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
              }}
              title={event.title}
              description={event.message}
            />
          )}
        </MapView>
        {loadingLocations && (
          <View style={styles(scheme).mapLoadingOverlay}>
            <ActivityIndicator
              size="large"
              color={scheme === "dark" ? "#FFFFFF" : "#000000"}
            />
          </View>
        )}
      </View>
    );
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
                {renderMapView(event, index)}
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
    mapLoadingOverlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor:
        scheme === "dark"
          ? "rgba(51, 51, 51, 0.8)"
          : "rgba(221, 221, 221, 0.8)", // Darker or lighter overlay based on theme
      justifyContent: "center",
      alignItems: "center",
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
