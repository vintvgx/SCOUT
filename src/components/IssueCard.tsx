import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SentryItem } from "../model/issue";

interface IssueCardProps {
  issue: SentryItem;
  onPress: () => void;
  isNew: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress, isNew }) => {
  const eventsCount = issue.events ? issue.events.length : "N/A";

  const cardStyle = [
    styles.card,
    isNew && styles.newIssue, // Highlight new issues distinctly
  ];

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <Text style={styles.title}>{issue.title}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Events: {eventsCount}</Text>
        <Text style={styles.detail}>
          First Seen: {new Date(issue.firstSeen).toLocaleString()}
        </Text>
        <Text style={styles.detail}>
          Last Seen: {new Date(issue.lastSeen).toLocaleString()}
        </Text>
      </View>
      {isNew && (
        <View style={styles.newTag}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default IssueCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
  },
  newIssue: {
    borderColor: "#BB86FC",
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detailsContainer: {
    paddingLeft: 10,
    borderLeftColor: "#BB86FC",
    borderLeftWidth: 4,
  },
  detail: {
    fontSize: 14,
    color: "#A5A5A5",
    marginBottom: 4,
  },
  newTag: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#BB86FC",
    borderRadius: 4,
    padding: 4,
  },
  newText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
