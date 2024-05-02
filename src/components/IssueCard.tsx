import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SentryItem } from "../model/issue";

interface IssueCardProps {
  issue: SentryItem;
  onPress: () => void;
  isNew: boolean;
}

const IssueCard = React.memo<IssueCardProps>(({ issue, onPress, isNew }) => {
  const scheme = useColorScheme(); // Detects the color scheme (light or dark)
  const eventsCount = issue.events ? issue.events.length : "N/A";

  // Styles dynamically adjusted according to the theme
  const cardStyle = [
    scheme === "dark" ? styles.cardDark : styles.cardLight,
    isNew && styles.newIssue, // Highlight new issues distinctly
  ];

  const detailStyle =
    scheme === "dark" ? styles.detailDark : styles.detailLight;

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <Text style={scheme === "dark" ? styles.titleDark : styles.titleLight}>
        {issue.title}
      </Text>
      <View style={styles.detailsContainer}>
        <Text style={detailStyle}>Events: {eventsCount}</Text>
        <Text style={detailStyle}>
          First Seen: {new Date(issue.firstSeen).toLocaleString()}
        </Text>
        <Text style={detailStyle}>
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
});

export default IssueCard;

const styles = StyleSheet.create({
  cardDark: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
    width: "98.5%",
  },
  cardLight: {
    backgroundColor: "#F7F7F7", // Changed from white to light gray for better contrast
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000", // Darker shadow for better contrast
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Increased opacity for a more pronounced shadow
    shadowRadius: 6, // Slightly larger radius for a softer spread
    elevation: 10, // Slightly raised elevation for more depth
  },
  newIssue: {
    borderColor: "#BB86FC",
    borderWidth: 0.5,
  },
  titleDark: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  titleLight: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  detailsContainer: {
    paddingLeft: 10,
    borderLeftColor: "#BB86FC",
    borderLeftWidth: 4,
  },
  detailDark: {
    fontSize: 14,
    color: "#A5A5A5",
    marginBottom: 4,
  },
  detailLight: {
    fontSize: 14,
    color: "#333333",
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
