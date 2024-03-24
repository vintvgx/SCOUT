import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Issue, SentryIssue } from "../model/issue";

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.detail}>Count: {issue.count}</Text>
      <Text style={styles.detail}>
        First Seen: {new Date(issue.firstSeen).toLocaleString()}
      </Text>
      <Text style={styles.detail}>
        Last Seen: {new Date(issue.lastSeen).toLocaleString()}
      </Text>
      <Text style={styles.link}>View on Sentry</Text>
    </TouchableOpacity>
  );
};

export default IssueCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E", // Darker tone for the card background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF", // White for readability
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    color: "#A5A5A5", // Light grey for details, ensuring they are readable but less prominent
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    color: "#BB86FC", // Using a purple accent color for links, inspired by Material Design
    marginTop: 8,
  },
});
