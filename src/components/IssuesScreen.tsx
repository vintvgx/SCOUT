import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAppSelector } from "../redux/store";
import IssueCard from "./IssueCard";
import EventViewer from "./EventViewer";
import { SentryItem } from "../model/issue"; // Assuming SentryEvent is correctly imported
import { SentryEvent } from "../model/event";
import format from "pretty-format";
import { handleOpenEventModal } from "../utils/functions";

interface IssuesScreenType {
  projectId: string;
}

export const IssuesScreen: React.FC<IssuesScreenType> = ({ projectId }) => {
  const { projects, loading, error } = useAppSelector((state) => state.issues);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<SentryEvent[]>([]);

  // Ensure the project is defined and has issues
  const project = projects.find((p) => p.id === projectId);
  // A fallback for when project is undefined
  const issues = project?.issues || [];

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.center_of_screen} />
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  if (!project)
    return (
      <View>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        {issues.map((issue, index) => (
          <IssueCard
            key={issue.id || index}
            issue={issue}
            onPress={() =>
              handleOpenEventModal(issue, setSelectedEvents, setIsViewerVisible)
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
