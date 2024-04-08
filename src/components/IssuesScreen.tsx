import React, { useEffect, useMemo, useState } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  RefreshControl,
} from "react-native";
import { AppDispatch, useAppSelector } from "../redux/store";
import { AppDispatch, useAppSelector } from "../redux/store";
import IssueCard from "./IssueCard";
import EventViewer from "./EventViewer";
import { SentryItem } from "../model/issue"; // Assuming SentryEvent is correctly imported
import { SentryEvent } from "../model/event";
import format from "pretty-format";
import { handleOpenEventModal } from "../utils/functions";
import { useDispatch } from "react-redux";
import { fetchIssues, resetLoadedData } from "../redux/slices/ProjectsSlice";
import { useDispatch } from "react-redux";
import { fetchIssues, resetLoadedData } from "../redux/slices/ProjectsSlice";

interface IssuesScreenType {
  projectName: string;
}

export const IssuesScreen: React.FC<IssuesScreenType> = ({ projectName }) => {
  const { projects, loading, error } = useAppSelector((state) => state.issues);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  // Ensure the project is defined and has issues
  const project = projects.find((p) => p.name === projectName);
  // A fallback for when project is undefined
  let issues = project?.issues || [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Dispatch fetchIssues action here. Assuming project.name exists and fetchIssues action is correctly defined.
    // Replace 'project?.name' with the appropriate value if necessary
    if (project?.name) {
      dispatch(resetLoadedData(project?.name));
      dispatch(fetchIssues(project?.name)).then(() => setRefreshing(false));
    }
  }, [dispatch, projectName]);

  const sortedIssues = useMemo(() => {
    // Clone and sort the issues array to avoid direct mutation
    return [...issues].sort((a, b) => {
      const dateA = new Date(a.lastSeen).getTime();
      const dateB = new Date(b.lastSeen).getTime();
      return dateB - dateA; // For descending order
    });
  }, [issues]);

  if (loading && sortedIssues.length === 0) {
  if (loading && sortedIssues.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.center_of_screen} size="small" />
        <ActivityIndicator style={styles.center_of_screen} size="small" />
      </View>
    );
  } else if (error) {
    // Handle error state
  } else if (error) {
    // Handle error state
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  } else if (!project) {
    // Handle case where project is not found
  } else if (!project) {
    // Handle case where project is not found
    return (
      <View style={styles.center_of_screen}>
      <View style={styles.center_of_screen}>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );
  }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {sortedIssues &&
          sortedIssues.length > 0 &&
          sortedIssues.map((issue, index) => (
            <IssueCard
              key={issue.id || index}
              issue={issue}
              onPress={() =>
                handleOpenEventModal(
                  issue,
                  setSelectedEvents,
                  setIsViewerVisible
                )
              }
            />
          ))}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {sortedIssues &&
          sortedIssues.length > 0 &&
          sortedIssues.map((issue, index) => (
            <IssueCard
              key={issue.id || index}
              issue={issue}
              onPress={() =>
                handleOpenEventModal(
                  issue,
                  setSelectedEvents,
                  setIsViewerVisible
                )
              }
            />
          ))}
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
    color: "red",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
});
