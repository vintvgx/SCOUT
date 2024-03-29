import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Project } from "../model/project";
import { SentryItem } from "../model/issue";
import { SentryEvent } from "../model/event";
import { useAppSelector } from "../redux/store";

const Map = () => {
  const INITIAL_REGION = {
    latitude: 42.3601,
    longitude: -71.0589,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const { projects } = useAppSelector((state) => state.issues);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton>
        {projects.map((project: Project) =>
          project.issues.map((issue: SentryItem) =>
            issue?.events?.map((event: SentryEvent) =>
              event.location ? (
                <Marker
                  key={event.id} // Assuming each event has a unique ID
                  coordinate={{
                    latitude: event?.location?.address?.latitude,
                    longitude: event?.location?.address?.longitude,
                  }}
                  title={event.message} // Optional: use event message or other relevant data as the marker title
                />
              ) : null
            )
          )
        )}
      </MapView>
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
