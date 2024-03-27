import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AppDispatch, useAppSelector } from "../redux/store";
import IssueCard from "./IssueCard";

interface ErrorsScreenType {
  projectId: string;
}

export const ErrorsScreen: React.FC<ErrorsScreenType> = ({ projectId }) => {
  const { projects, loading, error } = useAppSelector((state) => state.issues);

  const project = projects.find((project) => project.id === projectId);

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <ActivityIndicator />
        </View>
      </View>
    );

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.center_of_screen}>
          <Text style={styles.errorText}>Project not found.</Text>
        </View>
      </View>
    );
  }

  const errors = project.errors;

  return (
    <View style={styles.container}>
      <ScrollView>
        {errors && errors.length > 0 ? (
          errors.map((error, index) => (
            <IssueCard
              key={error.id || index} // It's better to use issue.id if available
              issue={error}
              onPress={() => console.log("Pressed issue", error)}
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
    color: "gray",
    textAlign: "center",
    marginTop: 30,
  },
});
