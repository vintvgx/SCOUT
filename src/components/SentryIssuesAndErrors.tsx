import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { SentryEvent } from "../model/event";
import { AppDispatch, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import {
  fetchSentryIssues,
  resetLoadedData,
} from "../redux/slices/SentryDataSlice";
import SentryCard from "./SentryCard";
import { handleOpenEventModal } from "../utils/functions";
import EventViewer from "./EventViewer";
import { Project } from "../model/project";
import { SentryItem } from "../model/issue";

interface SentryIssuesAndErrorsType {
  projectName: string;
  data: any;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SentryIssuesAndErrors: React.FC<SentryIssuesAndErrorsType> = ({
  projectName,
  data,
}) => {
  const scheme = "dark";
  const dispatch: AppDispatch = useDispatch();
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [issues, setIssues] = useState<SentryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { newIssues } = useAppSelector((state) => state.issues);

  const project = useAppSelector((state) =>
    state.issues.projects.find((p) => p.name === projectName)
  );

  useEffect(() => {
    const asyncFetch = async () => {
      setLoading(true);
      if (data) {
        console.log("DATA INCLUDED: FETCHING ISSUES FOR PROJECT", projectName);
        console.log("DATA:", data);
        dispatch(resetLoadedData(projectName));
        await dispatch(fetchSentryIssues(projectName)).catch((error) =>
          console.error("Failed to fetch issue details:", error)
        );
      } else {
        console.log("FETCHING ISSUES FOR PROJECT", projectName);
        await dispatch(fetchSentryIssues(projectName));
      }
      await sleep(500);
      setLoading(false);
    };
    asyncFetch();
  }, [dispatch, data]);

  useEffect(() => {
    if (project) {
      setIssues([...project.issues, ...project.errors]);
    }
  }, [project]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (projectName) {
      dispatch(resetLoadedData(projectName));
      dispatch(fetchSentryIssues(projectName)).then(() => setRefreshing(false));
    }
  }, [dispatch, projectName]);

  const handleRemove = (id: string) => {
    setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
  };

  const sortedIssues = useMemo(() => {
    return issues.sort((a, b) => {
      const dateA = new Date(a.lastSeen).getTime();
      const dateB = new Date(b.lastSeen).getTime();
      return dateB - dateA;
    });
  }, [issues]);

  if (loading || refreshing) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: scheme === "dark" ? "#121212" : "#FFF",
        }}>
        <ActivityIndicator style={styles.center_of_screen} size="small" />
      </View>
    );
  }

  if (!loading && sortedIssues.length === 0) {
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
        {sortedIssues.map((item, index) => (
          <SentryCard
            key={item.id}
            item={item}
            isNew={newIssues.includes(item.id)}
            onPress={() =>
              handleOpenEventModal(
                item,
                setSelectedEvents,
                setIsViewerVisible,
                dispatch
              )
            }
            onRemove={handleRemove}
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

export default SentryIssuesAndErrors;

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
