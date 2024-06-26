import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Animated,
} from "react-native";
import { SentryItem } from "../model/issue";
import { useDispatch } from "react-redux";
import { archiveSentryIssue } from "../redux/slices/SentryDataSlice";
import { AppDispatch } from "../redux/store";

interface SentryCardProps {
  item: SentryItem;
  onPress: () => void;
  isNew: boolean;
  onRemove: (id: string) => void;
}

const SentryCard = React.memo<SentryCardProps>(
  ({ item, onPress, isNew, onRemove }) => {
    const scheme = "dark";
    const eventsCount = item.events ? item.events.length : "N/A";
    const dispatch: AppDispatch = useDispatch();
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity value
    const shakeAnim = useRef(new Animated.Value(0)).current;

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
              console.log(item.id);
              dispatch(
                archiveSentryIssue({
                  issueId: item.id,
                  projectName: item.project.name,
                })
              ).then((result) => {
                if (archiveSentryIssue.fulfilled.match(result)) {
                  // Trigger fade-out animation on success
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                  }).start(() => {
                    onRemove(item.id); // Notify parent to remove the item
                  });
                } else {
                  // Trigger shake animation on failure
                  Animated.sequence([
                    Animated.timing(shakeAnim, {
                      toValue: 10,
                      duration: 50,
                      useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                      toValue: -10,
                      duration: 50,
                      useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                      toValue: 10,
                      duration: 50,
                      useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                      toValue: -10,
                      duration: 50,
                      useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                      toValue: 0,
                      duration: 50,
                      useNativeDriver: true,
                    }),
                  ]).start();
                }
              });
            },
          },
        ]
      );
    };

    return (
      <Animated.View
        style={[
          { transform: [{ translateX: shakeAnim }] },
          { opacity: fadeAnim },
          cardStyle,
        ]}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.header}>
            <Text
              style={[
                scheme === "dark" ? styles.titleDark : styles.titleLight,
                isNew ? { width: "90%" } : { width: "auto" },
              ]}>
              {item.title}
            </Text>
          </View>
          <View style={detailsContainer}>
            <Text style={[detailStyle, { fontWeight: "bold" }]}>
              Events: {eventsCount}
            </Text>
            <Text style={detailStyle}>
              First Event: {new Date(item.firstSeen).toLocaleString()}
            </Text>
            <Text style={detailStyle}>
              Latest Event: {new Date(item.lastSeen).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleArchive} style={styles.archiveButton}>
          <Text style={styles.archiveText}>Archive</Text>
        </TouchableOpacity>
        {isNew && (
          <View style={styles.newTagContainer}>
            <View style={styles.newTag}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          </View>
        )}
        {item.status === "archived" && (
          <View style={styles.newTag}>
            <Text style={styles.newText}>ARCHIVED</Text>
          </View>
        )}
      </Animated.View>
    );
  }
);

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
    // width: "90%",
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
  newTagContainer: {
    position: "absolute",
    right: 0,
    top: 15,
    // transform: [{ rotate: "90deg" }],
  },
  newTag: {
    backgroundColor: "#BB86FC",
    // borderRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  newText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "400",
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
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  archiveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
