import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { AppDispatch, useAppSelector } from "../redux/store";
import IssueCard from "./IssueCard";
import { SentryEvent } from "../model/event";
import { SentryItem } from "../model/issue";
import EventViewer from "./EventViewer";
import { handleOpenEventModal } from "../utils/functions";
import format from "pretty-format";
import { useDispatch } from "react-redux";
import {
  fetchSentryIssues,
  resetLoadedData,
} from "../redux/slices/SentryDataSlice";

interface ErrorsScreenType {
  projectName: string;
}

export const SentryErrorsView: React.FC<ErrorsScreenType> = ({
  projectName,
}) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  // const scheme = useColorScheme();
  const scheme = "dark";

  const dispatch: AppDispatch = useDispatch();

  const { projects, loading, error, newIssues } = useAppSelector(
    (state) => state.issues
  );

  // Ensure the project is defined and has issues
  const project = projects.find((p) => p.name === projectName);
  // A fallback for when project is undefined
  const errors = project?.errors || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // Dispatch fetchSentryIssues action here. Assuming project.name exists and fetchSentryIssues action is correctly defined.
    if (project?.name) {
      dispatch(resetLoadedData(project?.name));
      dispatch(fetchSentryIssues(project?.name)).then(() =>
        setRefreshing(false)
      );
    }
  }, [dispatch, projectName]);

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
      <View
        style={{
          flex: 1,
          backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
        }}>
        <View style={styles.center_of_screen}>
          <ActivityIndicator />
        </View>
      </View>
    );

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
        }}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
        }}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>Project not found.</Text>
        </View>
      </View>
    );
  }

  // const errors = project.errors;
  // const errors = project.errors;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={"white"}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {sortedErrors && sortedErrors.length > 0 ? (
          sortedErrors.map((error, index) => (
            <IssueCard
              key={error.id || index} // It's better to use issue.id if available
              issue={error}
              isNew={newIssues.includes(error.id)}
              onPress={() => {
                handleOpenEventModal(
                  error,
                  setSelectedEvents,
                  setIsViewerVisible,
                  dispatch
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
