import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { SentryItem } from "../model/issue";
import { useDispatch } from "react-redux";
import { archiveSentryIssue } from "../redux/slices/SentryDataSlice";
import { AppDispatch } from "../redux/store";

interface SentryCardProps {
  item: SentryItem;
  onPress: () => void;
  isNew: boolean;
}

const SentryCard = React.memo<SentryCardProps>(({ item, onPress, isNew }) => {
  const scheme = "dark";
  const eventsCount = item.events ? item.events.length : "N/A";
  const dispatch: AppDispatch = useDispatch();

  const cardStyle = [
    scheme === "dark" ? styles.cardDark : styles.cardLight,
    isNew && styles.newIssue,
  ];

  const detailsContainer = [
    styles.detailsContainer,
    { borderLeftColor: item.level == "error" ? "#FF0000" : "#BB86FC" },
  ];

  const detailStyle =
    scheme === "dark" ? styles.detailDark : styles.detailLight;

  const handleArchive = () => {
    Alert.alert(
      "Confirm Archive",
      "Are you sure you want to archive this issue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: () => {
            dispatch(
              archiveSentryIssue({
                issueId: item.id,
                projectName: item.project.name,
              })
            );
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <View style={styles.header}>
        <Text style={scheme === "dark" ? styles.titleDark : styles.titleLight}>
          {item.title}
        </Text>
        <TouchableOpacity onPress={handleArchive} style={styles.archiveButton}>
          <Text style={styles.archiveText}>Archive</Text>
        </TouchableOpacity>
      </View>
      <View style={detailsContainer}>
        <Text style={detailStyle}>Events: {eventsCount}</Text>
        <Text style={detailStyle}>
          First Seen: {new Date(item.firstSeen).toLocaleString()}
        </Text>
        <Text style={detailStyle}>
          Last Seen: {new Date(item.lastSeen).toLocaleString()}
        </Text>
      </View>

      {isNew && (
        <View style={styles.newTag}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
      {item.status === "archived" && (
        <View style={styles.newTag}>
          <Text style={styles.newText}>ARCHIVED</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default SentryCard;

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
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  archiveButton: {
    backgroundColor: "#333333",
    borderRadius: 4,
    padding: 4,
  },
  archiveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
