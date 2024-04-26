import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Project } from "../model/project";
import { SentryItem } from "../model/issue";
import { SentryEvent } from "../model/event";
import { useAppSelector, AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { fetchIssues } from "../redux/slices/ProjectsSlice";
import MapViewModal from "../components/MapViewModal";

const Map = () => {
  const INITIAL_REGION = {
    latitude: 42.3601,
    longitude: -71.0589,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const scheme = useColorScheme();
  const { projects } = useAppSelector((state) => state.issues);
  const dispatch: AppDispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<SentryItem | null>(null);

  useEffect(() => {
    // Fetch issues for all projects
    projects.forEach((project) => {
      dispatch(fetchIssues(project.name));
    });
  }, []);

  const handleMarkerPress = (issue: SentryItem) => {
    setSelectedIssue(issue);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton>
        {projects.map((project) =>
          project.issues.map((issue) =>
            issue?.events?.map((event) =>
              event.location ? (
                <Marker
                  key={event.id} // Assuming each event has a unique ID
                  coordinate={{
                    latitude: event?.location?.latitude,
                    longitude: event?.location?.longitude,
                  }}
                  title={event.message} // Optional: use event message or other relevant data as the marker title
                  onPress={() => handleMarkerPress(issue)}
                />
              ) : null
            )
          )
        )}
      </MapView>
      <MapViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        issue={selectedIssue}
      />
    </SafeAreaView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
