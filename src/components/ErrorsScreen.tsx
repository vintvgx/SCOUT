import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AppDispatch, useAppSelector } from "../redux/store";
import IssueCard from "./IssueCard";
import { SentryEvent } from "../model/event";
import { SentryItem } from "../model/issue";
import EventViewer from "./EventViewer";
import { handleOpenEventModal } from "../utils/functions";
import format from "pretty-format";

interface ErrorsScreenType {
  projectId: string;
}

export const ErrorsScreen: React.FC<ErrorsScreenType> = ({ projectId }) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);

  const { projects, loading, error } = useAppSelector((state) => state.issues);

  // Ensure the project is defined and has issues
  const project = projects.find((p) => p.id === projectId);
  // A fallback for when project is undefined
  const issues = project?.issues || [];

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <ActivityIndicator />
        </View>
      </View>
    );

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>Project not found.</Text>
        </View>
      </View>
    );
  }

  const errors = project.errors;

  return (
    <View style={styles.container}>
      <ScrollView>
        {errors && errors.length > 0 ? (
          errors.map((error, index) => (
            <IssueCard
              key={error.id || index} // It's better to use issue.id if available
              issue={error}
              onPress={() => {
                console.log(format(error));
                handleOpenEventModal(
                  error,
                  setSelectedEvents,
                  setIsViewerVisible
                );
              }}
            />
          ))
        ) : (
          <View style={styles.center_of_screen}>
            <Text style={styles.errorText}>
              No errors found for this project.
            </Text>
          </View>
        )}
      </ScrollView>
      <EventViewer
        events={selectedEvents}
        isVisible={isViewerVisible}
        onClose={() => setIsViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  center_of_screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "gray",
    textAlign: "center",
    marginTop: 30,
  },
});
