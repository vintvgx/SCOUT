import React, { useEffect, useMemo, useState } from "react";
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
import EventViewer from "./EventViewer";
import { SentryItem } from "../model/issue"; // Assuming SentryEvent is correctly imported
import { SentryEvent } from "../model/event";
import format from "pretty-format";
import { handleOpenEventModal } from "../utils/functions";
import { useDispatch } from "react-redux";
import {
  fetchSentryIssues,
  resetLoadedData,
} from "../redux/slices/SentryDataSlice";

interface IssuesScreenType {
  projectName: string;
}

export const SentryIssuesView: React.FC<IssuesScreenType> = ({
  projectName,
}) => {
  const dispatch: AppDispatch = useDispatch();
  // const scheme = useColorScheme();
  const scheme = "dark";
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { projects, loading, error, newIssues } = useAppSelector(
    (state) => state.issues
  );

  const project = projects.find((p) => p.name === projectName); // Ensure the project is defined and has issues

  let issues = project?.issues || []; // A fallback for when project is undefined

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
        <View
          style={{
            flex: 1,
            backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
          }}>
          <ActivityIndicator style={styles.center_of_screen} size="small" />
        </View>
      );
    } else if (error) {
      // Handle error state
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
          }}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    } else if (!project) {
      // Handle case where project is not found
      return (
        <View
          style={[
            styles.center_of_screen,
            { backgroundColor: scheme === "dark" ? "#121212" : "#FFF" },
          ]}>
          <Text style={styles.errorText}>Project not found.</Text>
        </View>
      );
    } else if (!loading && sortedIssues.length === 0) {
      // Handle case where there are no issues
      return (
        <View
          style={[
            styles.center_of_screen,
            { backgroundColor: scheme === "dark" ? "#121212" : "#FFF" },
          ]}>
          <Text style={styles.errorText}>No issues found.</Text>
        </View>
      );
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
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
        {sortedIssues &&
          sortedIssues.length > 0 &&
          sortedIssues.map((issue, index) => (
            <IssueCard
              key={issue.id || index}
              issue={issue}
              isNew={newIssues.includes(issue.id)}
              onPress={() =>
                handleOpenEventModal(
                  issue,
                  setSelectedEvents,
                  setIsViewerVisible,
                  dispatch
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
