import React, { useMemo, useState } from "react";
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
  const errors = project?.errors || [];

  const sortedErrors = useMemo(() => {
    // Clone and sort the issues array to avoid direct mutation
    return [...errors].sort((a, b) => {
      const dateA = new Date(a.lastSeen).getTime();
      const dateB = new Date(b.lastSeen).getTime();
      return dateB - dateA; // For descending order
    });
  }, [errors]);

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

  // const errors = project.errors;

  return (
    <View style={styles.container}>
      <ScrollView>
        {sortedErrors && sortedErrors.length > 0 ? (
          sortedErrors.map((error, index) => (
            <IssueCard
              key={error.id || index} // It's better to use issue.id if available
              issue={error}
              onPress={() => {
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
